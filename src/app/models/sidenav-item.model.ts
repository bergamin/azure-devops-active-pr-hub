export class SidenavItem {
  constructor(
    public text: string,
    public path: string,
    public icon = 'chevron-right',
    public selected = false,
  ) { }
}
