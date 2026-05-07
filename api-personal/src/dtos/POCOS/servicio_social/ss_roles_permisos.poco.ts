export class SsRolesPermisos {
  constructor(
    public readonly id: number,
    public readonly idSsRol: number,
    public readonly nombreRol: string,
    public readonly idSsPermiso: number,
    public readonly nombrePermiso: string,
  ) {}
}