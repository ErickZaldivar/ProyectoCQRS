import { Controller, Get, Post, Put, Param, Body, ParseIntPipe, ParseBoolPipe, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../../../infrastructure/security/auth/Jwt.guard';
import { ObtenerSsProgramas } from '../../logic/servicio_Social/Programas/obtemer_ss_programas';
import { CrearSsProgramaUseCase } from '../../logic/servicio_Social/Programas/crear_ss_programas';
import { CrearSsProgramaDto } from '../../../dtos/requests/Servicio Social/Programas/crear_ss_programas';
import { EliminarSsProgramasUseCase } from '../../logic/servicio_Social/Programas/eliminar_ss_programas';
import { ActualizarSsProgramaUseCase } from '../../logic/servicio_Social/Programas/actualizar_ss_programas';
import { ActualizarSsProgramaDto } from '../../../dtos/requests/Servicio Social/Programas/avtualizar_ss_programas';
import { SsProgramasPresenter } from '../../presenters/servicio_social/ss_programas.presenter';

@ApiTags('Servicio Social - Programas')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('servicio-social/programas')
export class SsProgramasController {

  constructor(
    private readonly obtenerSsProgramasUseCase: ObtenerSsProgramas,
    private readonly crearSsProgramaUseCase: CrearSsProgramaUseCase,
    private readonly eliminarSsProgramasUseCase: EliminarSsProgramasUseCase,
    private readonly actualizarSsProgramasUseCase: ActualizarSsProgramaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los programas' })
  @ApiResponse({ status: 200, description: 'Lista de programas obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron programas' })
  async ObtenerTodos() {
    return this.obtenerSsProgramasUseCase.ObtenerTodos();
  }

  @Get('vigentes')
  @ApiOperation({ summary: 'Obtener programas vigentes' })
  @ApiResponse({ status: 200, description: 'Lista de programas vigentes obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron programas vigentes' })
  async ObtenerVigentes() {
    return this.obtenerSsProgramasUseCase.ObtenerVigentes();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener programa por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del programa' })
  @ApiResponse({ status: 200, description: 'Programa encontrado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Programa no encontrado' })
  async ObtenerPorId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.obtenerSsProgramasUseCase.ObtenerPorId(id);
  }

  @Get('nombre/:nombrePrograma')
  @ApiOperation({ summary: 'Obtener programas por nombre' })
  @ApiParam({ name: 'nombrePrograma', type: String, description: 'Nombre del programa a buscar' })
  @ApiResponse({ status: 200, description: 'Programas encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron programas con ese nombre' })
  async ObtenerPorNombrePrograma(
    @Param('nombrePrograma') nombrePrograma: string
  ) {
    return this.obtenerSsProgramasUseCase.ObtenerPorNombrePrograma(nombrePrograma);
  }

  @Get('organizacion/:idOrganizacion')
  @ApiOperation({ summary: 'Obtener programas por organización' })
  @ApiParam({ name: 'idOrganizacion', type: Number, description: 'Id de la organización' })
  @ApiResponse({ status: 200, description: 'Programas encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron programas para esa organización' })
  async ObtenerPorOrganizacion(
    @Param('idOrganizacion', ParseIntPipe) idOrganizacion: number
  ) {
    return this.obtenerSsProgramasUseCase.ObtenerPorOrganizacion(idOrganizacion);
  }

  @Get('tipo/:idTipoPrograma')
  @ApiOperation({ summary: 'Obtener programas por tipo' })
  @ApiParam({ name: 'idTipoPrograma', type: Number, description: 'Id del tipo de programa' })
  @ApiResponse({ status: 200, description: 'Programas encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron programas para ese tipo' })
  async ObtenerPorTipoPrograma(
    @Param('idTipoPrograma', ParseIntPipe) idTipoPrograma: number
  ) {
    return this.obtenerSsProgramasUseCase.ObtenerPorTipoPrograma(idTipoPrograma);
  }

  @Get('modalidad/:modalidad')
  @ApiOperation({ summary: 'Obtener programas por modalidad', description: 'true = interno, false = externo' })
  @ApiParam({ name: 'modalidad', type: Boolean, description: 'Modalidad del programa (true = interno, false = externo)' })
  @ApiResponse({ status: 200, description: 'Programas encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron programas con esa modalidad' })
  async ObtenerPorModalidad(
    @Param('modalidad', ParseBoolPipe) modalidad: boolean
  ) {
    return this.obtenerSsProgramasUseCase.ObtenerPorModalidad(modalidad);
  }
  
  @Delete('id/:id')
  @ApiOperation({ summary: 'Eliminar un programa por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del programa a eliminar' })
  @ApiResponse({ status: 200, description: 'Programa eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Programa no encontrado' })
  async Eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.eliminarSsProgramasUseCase.Ejecutar(id);
    return { 
      statusCode: 200,
      message: `El programa con id ${id} fue eliminado correctamente.` 
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('plan_trabajo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear un nuevo programa' })
  @ApiResponse({ status: 201, description: 'Programa creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Ya existe un programa con ese nombre' })
  async Crear(
    @Body() dto: CrearSsProgramaDto,
    @UploadedFile() file?: any,
  ) {
    const planTrabajo = file ? file.buffer : undefined;
    return this.crearSsProgramaUseCase.Ejecutar(dto, planTrabajo);
  }

  @Put('id/:id')
  @UseInterceptors(FileInterceptor('plan_trabajo'))
  @ApiOperation({ summary: 'Actualizar un programa por ID' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number, description: 'ID del programa a actualizar' })
  @ApiResponse({ status: 200, description: 'Programa actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Programa no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un programa con ese nombre' })
  async Actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSsProgramaDto,
    @UploadedFile() file?: any,
  )  {
    const planTrabajo = file ? file.buffer : undefined;
    const poco = await this.actualizarSsProgramasUseCase.Ejecutar(id, dto, planTrabajo);
    return SsProgramasPresenter.Presentar(poco);
  }
}
