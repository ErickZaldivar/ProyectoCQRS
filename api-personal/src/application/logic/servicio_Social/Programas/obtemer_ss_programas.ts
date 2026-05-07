import { Injectable, Inject, NotFoundException } from '@nestjs/common';
    import { ISsProgramasRepository } from '../../../../domain/interfaces/servicio_social/ss_programas.interface';
import { SsProgramasResponse } from '../../../../dtos/responses/servicio_social/ss_programas.respinse';
import { SsProgramasPresenter } from '../../../presenters/servicio_social/ss_programas.presenter';

@Injectable()
export class ObtenerSsProgramas {

  constructor(
    @Inject('ISsProgramasRepository')
    private readonly ssProgramasRepository: ISsProgramasRepository,
  ) {}

  async ObtenerTodos(): Promise<SsProgramasResponse[]> {
    const programas = await this.ssProgramasRepository.ObtenerTodos();

    if (!programas || programas.length === 0) {
      throw new NotFoundException('No se encontraron programas');
    }

    return SsProgramasPresenter.PresentarLista(programas);
  }

  async ObtenerPorId(id: number): Promise<SsProgramasResponse> {
    const programa = await this.ssProgramasRepository.ObtenerPorId(id);

    if (!programa) {
      throw new NotFoundException(`No se encontró el programa con id ${id}`);
    }

    return SsProgramasPresenter.Presentar(programa);
  }

  async ObtenerPorNombrePrograma(nombrePrograma: string): Promise<SsProgramasResponse[]> {
    const programas = await this.ssProgramasRepository.ObtenerPorNombrePrograma(nombrePrograma);

    if (!programas || programas.length === 0) {
      throw new NotFoundException(`No se encontraron programas con el nombre ${nombrePrograma}`);
    }

    return SsProgramasPresenter.PresentarLista(programas);
  }

  async ObtenerPorOrganizacion(idOrganizacion: number): Promise<SsProgramasResponse[]> {
    const programas = await this.ssProgramasRepository.ObtenerPorOrganizacion(idOrganizacion);

    if (!programas || programas.length === 0) {
      throw new NotFoundException(`No se encontraron programas para la organización con id ${idOrganizacion}`);
    }

    return SsProgramasPresenter.PresentarLista(programas);
  }

  async ObtenerPorTipoPrograma(idTipoPrograma: number): Promise<SsProgramasResponse[]> {
    const programas = await this.ssProgramasRepository.ObtenerPorTipoPrograma(idTipoPrograma);

    if (!programas || programas.length === 0) {
      throw new NotFoundException(`No se encontraron programas para el tipo con id ${idTipoPrograma}`);
    }

    return SsProgramasPresenter.PresentarLista(programas);
  }

  async ObtenerPorModalidad(modalidad: boolean): Promise<SsProgramasResponse[]> {
    const programas = await this.ssProgramasRepository.ObtenerPorModalidad(modalidad);

    if (!programas || programas.length === 0) {
      throw new NotFoundException('No se encontraron programas con esa modalidad');
    }

    return SsProgramasPresenter.PresentarLista(programas);
  }

  async ObtenerVigentes(): Promise<SsProgramasResponse[]> {
    const programas = await this.ssProgramasRepository.ObtenerVigentes();

    if (!programas || programas.length === 0) {
      throw new NotFoundException('No se encontraron programas vigentes');
    }

    return SsProgramasPresenter.PresentarLista(programas);
  }

}