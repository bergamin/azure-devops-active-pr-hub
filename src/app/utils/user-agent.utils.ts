export class UserAgentUtils {

  public static isAndroid(): boolean {
    return !!navigator.userAgent.match(/Android/i);
  }

  public static isIOS(): boolean {
    return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  public static isMobile(): boolean {
    return this.isAndroid() || this.isIOS();
  }
}
