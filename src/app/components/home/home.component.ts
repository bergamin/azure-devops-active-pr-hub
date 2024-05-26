import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PullRequest} from "../../models/pull-request.model";
import {Settings} from "../../models/settings.model";
import {Reviewer} from "../../models/reviewer.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pullRequests: PullRequest[] = [];
  globalSettings = new Settings();
  azureDevOpsBaseUrl = '';

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const storageSettings = localStorage.getItem('settings');
    this.globalSettings = storageSettings
      ? JSON.parse(storageSettings)
      : new Settings();
    this.azureDevOpsBaseUrl = `https://dev.azure.com/${this.globalSettings.organization}/${this.globalSettings.project}`;
    this.updatePRList();
  }

  updatePRList() {
    if (this.globalSettings.organization && this.globalSettings.project && this.globalSettings.base64pat) {
      this.getPullRequests().subscribe(pullRequests => {
        this.pullRequests = [];

        pullRequests.value.forEach(pullRequest => {
          pullRequest.isTargetValid = true;
          if (this.globalSettings.repositories.length === 0 ||
            this.globalSettings.repositories.includes(pullRequest.repository.id) ||
            this.globalSettings.repositories.includes(pullRequest.repository.name)) {

            const creationDate = new Date(pullRequest.creationDate);
            pullRequest.creationDate = `${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`;

            this.buildReviewStatus(pullRequest);
            this.buildPullRequestType(pullRequest);
            this.buildGeneralStatus(pullRequest);

            this.pullRequests.push(pullRequest);
          }
        });
      });
    }
  }

  private buildReviewStatus(pullRequest: PullRequest) {
    let worstRating = 999;

    for (const reviewer of pullRequest.reviewers) {
      if (reviewer.displayName.endsWith('- CODEREVIEW GERAL')) {
        reviewer.displayName = 'Code Review - Geral';
      } else if (reviewer.displayName.endsWith('- ARQUITETURA')) {
        reviewer.displayName = 'Code Review - Arquitetura';
      } else if (reviewer.displayName.endsWith('\\TECH LEAD') || reviewer.displayName.endsWith('- TECHLEAD')) {
        reviewer.displayName = 'Code Review - Tech Lead';
      } else if (reviewer.displayName.endsWith('\\UX')) {
        reviewer.displayName = 'Code Review - UX';
      } else if (reviewer.displayName.endsWith('\\DBA')) {
        reviewer.displayName = 'Code Review - DBA';
      }

      if (reviewer.isRequired && worstRating > reviewer.vote) {
        worstRating = reviewer.vote;
      }
    }

    switch (worstRating) {
      case 999:
        pullRequest.reviewStatus = pullRequest.reviewers.length === 0
          ? 'no reviewer'
          : 'no required reviewer';
        break;
      case 0:
        pullRequest.reviewStatus = pullRequest.isDraft
          ? 'waiting for publishing'
          : 'waiting for reviewer';
        break;
      case 5:
        pullRequest.reviewStatus = 'approved with suggestions';
        break;
      case 10:
        pullRequest.reviewStatus = 'approved';
        break;
      case -5:
        pullRequest.reviewStatus = 'waiting for author';
        break;
      case -10:
        pullRequest.reviewStatus = 'rejected';
        break;
      default:
        pullRequest.reviewStatus = worstRating.toString();
    }
  }

  private buildPullRequestType(pullRequest: PullRequest) {
    if (this.isBugfixBranch(pullRequest.sourceRefName)) {
      pullRequest.type = 'bugfix';
      if (this.isReleaseBranch(pullRequest.targetRefName) || this.isMainBranch(pullRequest.targetRefName)) {
        pullRequest.isTargetValid = false;
      } else if (!this.isReleaseCandidateBranch(pullRequest.targetRefName)) {
        pullRequest.type = '';
      }
    } else if (this.isFeatureBranch(pullRequest.sourceRefName)) {
      pullRequest.type = 'feature';
      if (this.isReleaseBranch(pullRequest.targetRefName) || this.isMainBranch(pullRequest.targetRefName)) {
        pullRequest.isTargetValid = false;
      } else if (!this.isReleaseCandidateBranch(pullRequest.targetRefName)) {
        pullRequest.type = 'update';
      }
    } else if (this.isReleaseCandidateBranch(pullRequest.sourceRefName)) {
      pullRequest.type = this.isReleaseBranch(pullRequest.targetRefName)
        ? 'release'
        : 'update';
      if (this.isMainBranch(pullRequest.targetRefName)) {
        pullRequest.isTargetValid = false;
      }
    } else if (this.isReleaseBranch(pullRequest.sourceRefName)) {
      if (this.isMainBranch(pullRequest.targetRefName) || this.isDevelopBranch(pullRequest.targetRefName)) {
        pullRequest.type = 'delivery';
      } else {
        pullRequest.type = 'update';
      }
      if (this.isReleaseBranch(pullRequest.targetRefName)) {
        pullRequest.isTargetValid = false;
      }
    } else if (this.isMainBranch(pullRequest.sourceRefName)) {
      pullRequest.type = 'update';
      if (this.isReleaseBranch(pullRequest.targetRefName)) {
        pullRequest.isTargetValid = false;
      }
    }
    if (this.isDevelopBranch(pullRequest.targetRefName) && !this.isReleaseBranch(pullRequest.sourceRefName)) {
      pullRequest.type = 'develop';
    } else if (!pullRequest.type) {
      pullRequest.type = 'unknown';
      if (this.isReleaseBranch(pullRequest.targetRefName) || this.isMainBranch(pullRequest.targetRefName)) {
        pullRequest.isTargetValid = false;
      }
    }
  }

  private buildGeneralStatus(pullRequest: PullRequest) {
    pullRequest.generalStatus = 'neutral'
    if (pullRequest.isDraft) {
      pullRequest.generalStatus = 'draft';
    } else if (pullRequest.mergeStatus === 'conflicts' ||
               pullRequest.reviewStatus === 'rejected' ||
               this.isMainBranch(pullRequest.targetRefName) ||
               !pullRequest.isTargetValid) {
      pullRequest.generalStatus = 'negative';
    } else if (pullRequest.reviewStatus === 'waiting for author') {
      pullRequest.generalStatus = 'warning';
    } else if (pullRequest.reviewStatus === 'no reviewer' ||
               pullRequest.reviewStatus === 'no required reviewer' ||
               pullRequest.reviewStatus.startsWith('approved')) {
      pullRequest.generalStatus = 'positive';
    }
  }

  private getPullRequests(): Observable<{count: number, value: PullRequest[]}> {
    return this.http.get<{count: number, value: PullRequest[]}>(`${this.azureDevOpsBaseUrl}/_apis/git/pullrequests?api-version=7.0`, {
      headers: {
        'Authorization': `Basic ${this.globalSettings.base64pat}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private isMainBranch(branchRefName: string): boolean {
    return branchRefName === 'refs/heads/master' || branchRefName === 'refs/heads/main';
  }

  private isDevelopBranch(branchRefName: string): boolean {
    return branchRefName === 'refs/heads/develop';
  }

  private isFeatureBranch(branchRefName: string): boolean {
    return branchRefName.startsWith('refs/heads/feature/');
  }

  private isBugfixBranch(branchRefName: string): boolean {
    return branchRefName.startsWith('refs/heads/bugfix/');
  }

  private isReleaseCandidateBranch(branchRefName: string): boolean {
    return branchRefName.startsWith('refs/heads/rc/');
  }

  private isReleaseBranch(branchRefName: string): boolean {
    return branchRefName.startsWith('refs/heads/release/');
  }

  toTitleCase(text: string, firstWordOnly = false): string {
    return firstWordOnly
      ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      : text.split(' ').map(word => this.toTitleCase(word, true)).join(' ');
  }

  getReviewStatus(reviewer: Reviewer): string {
    switch (reviewer.vote) {
      case 10:
        return 'Approved';
      case 5:
        return 'Approved with suggestions';
      case -5:
        return 'Waiting for author';
      case -10:
        return 'Rejected';
      default:
        return '';
    }
  }
}
