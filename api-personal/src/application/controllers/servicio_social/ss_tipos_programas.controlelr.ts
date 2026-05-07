import { Controller, Get, Post, Delete, Put, Param, Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from '../../../infrastructure/security/auth/Jwt.guard';
import { ObtenerSsTiposProgramas } from '../../logic/servicio_Social/Tipos_Programas/obtener_ss_tipos_programas';
import { CrearSsTipoProgramaUseCase } from '../../logic/servicio_Social/Tipos_Programas/crear_ss_tipos_programas';
import { EliminarSsTipoProgramaUseCase } from '../../logic/servicio_Social/Tipos_Programas/eliminar_tipos_programas';
import { CrearSsTipoProgramaDto } from '../../../dtos/requests/Servicio Social/Tipos_Programas/crear_ss_tipos_programas';
import { ActualizarSsTipoProgramaUseCase } from '../../logic/servicio_Social/Tipos_Programas/actualizar_ss_tipos_programas.use.case';
import { ActualizarSsTipoProgramaDto } from '../../../dtos/requests/Servicio Social/Tipos_Programas/actualizar_ss_tipos_programas';

@ApiTags('Servicio Social - Tipos de Programas')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('servicio-social/tipos-programas')
export class SsTiposProgramasController {

  constructor(
    private readonly obtenerSsTiposProgramasUseCase: ObtenerSsTiposProgramas,
    private readonly crearSsTipoProgramaUseCase: CrearSsTipoProgramaUseCase,
    private readonly eliminarSsTipoProgramaUseCase: EliminarSsTipoProgramaUseCase,
    private readonly actualizarSsTipoProgramaUseCase: ActualizarSsTipoProgramaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de programas' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de programas obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron tipos de programas' })
  async ObtenerTodos() {
    return this.obtenerSsTiposProgramasUseCase.ObtenerTodos();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener tipo de programa por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del tipo de programa' })
  @ApiResponse({ status: 200, description: 'Tipo de programa encontrado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tipo de programa no encontrado' })
  async ObtenerPorId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.obtenerSsTiposProgramasUseCase.ObtenerPorId(id);
  }

  @Get('nombre/:nombreTipo')
  @ApiOperation({ summary: 'Obtener tipos de programas por nombre' })
  @ApiParam({ name: 'nombreTipo', type: String, description: 'Nombre del tipo de programa a buscar' })
  @ApiResponse({ status: 200, description: 'Tipos de programas encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron tipos de programas con ese nombre' })
  async ObtenerPorNombreTipo(
    @Param('nombreTipo') nombreTipo: string
  ) {
    return this.obtenerSsTiposProgramasUseCase.ObtenerPorNombreTipo(nombreTipo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo tipo de programa' })
  @ApiBody({ type: CrearSsTipoProgramaDto })
  @ApiResponse({ status: 201, description: 'Tipo de programa creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Ya existe un tipo de programa con ese nombre' })
  async Crear(
    @Body() dto: CrearSsTipoProgramaDto
  ) {
    return this.crearSsTipoProgramaUseCase.Ejecutar(dto);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar tipo de programa por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del tipo de programa a eliminar' })
  @ApiResponse({ status: 200, description: 'Tipo de programa eliminado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tipo de programa no encontrado' })
  async EliminarPorId(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.eliminarSsTipoProgramaUseCase.EliminarPorId(id);
    return { mensaje: `Tipo de programa con id ${id} eliminado correctamente` };
  }

  @Delete('nombre/:nombreTipo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar tipos de programas por nombre' })
  @ApiParam({ name: 'nombreTipo', type: String, description: 'Nombre del tipo de programa a eliminar' })
  @ApiResponse({ status: 200, description: 'Tipo de programa eliminado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tipo de programa no encontrado' })
  async EliminarPorNombre(
    @Param('nombreTipo') nombreTipo: string
  ) {
    await this.eliminarSsTipoProgramaUseCase.EliminarPorNombre(nombreTipo);
    return { mensaje: `Tipo de programa ${nombreTipo} eliminado correctamente` };
  }

  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar tipo de programa por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del tipo de programa a actualizar' })
  @ApiBody({ type: ActualizarSsTipoProgramaDto })
  @ApiResponse({ status: 200, description: 'Tipo de programa actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Tipo de programa no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un tipo de programa con ese nombre' })
  async Actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSsTipoProgramaDto
  ) {
    return this.actualizarSsTipoProgramaUseCase.Ejecutar(id, dto);
  }
}