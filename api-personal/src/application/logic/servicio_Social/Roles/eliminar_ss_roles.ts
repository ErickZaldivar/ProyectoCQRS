import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ISsRolesRepository } from '../../../../domain/interfaces/servicio_social/ss_roles.interface';

@Injectable()
export class EliminarSsRolesUseCase {
  constructor(
    @Inject('ISsRolesRepository')
    private readonly ssRolesRepository: ISsRolesRepository,
  ) {}

  async Ejecutar(id: number): Promise<void> {
    const rolExistente = await this.ssRolesRepository.ObtenerPorId(id);
    
    if (!rolExistente) {
      throw new NotFoundException(`No se encontró el rol con el id ${id}`);
    }

    try {
      await this.ssRolesRepository.Eliminar(id);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new ConflictException(
          `No se puede eliminar el rol '${rolExistente.rol}' porque actualmente tiene permisos asignados o está en uso. Elimine sus asignaciones primero.`
        );
      }
          throw error;
    }
  }
}