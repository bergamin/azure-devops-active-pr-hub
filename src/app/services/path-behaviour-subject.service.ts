import { BehaviorSubject, Observable } from 'rxjs';

export class PathBehaviourSubjectService {

  static instance: PathBehaviourSubjectService;

  currentPath = '';

  private currentPathBehaviourSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.currentPath);

  static getInstance(): PathBehaviourSubjectService {
    if (!this.instance) {
      this.instance = new PathBehaviourSubjectService();
    }
    return this.instance;
  }

  getCurrentPathObservable(): Observable<string> {
    return this.currentPathBehaviourSubject.asObservable();
  }

  setCurrentPathObservable(path: string) {
    this.currentPathBehaviourSubject.next(path);
  }
}
