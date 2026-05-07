import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from '../../../infrastructure/security/auth/Jwt.guard';
import { ObtenerSsPermisos } from '../../logic/servicio_Social/Permisos/obtener_ss_permisos';
import { CrearSsPermisosDto } from '../../../dtos/requests/Servicio Social/Permisos/crear_ss_permisos.dto';
import { CrearSsPermisosUseCase } from '../../logic/servicio_Social/Permisos/crear_ss_permisos';
import { EliminarSsPermisosUseCase } from '../../logic/servicio_Social/Permisos/eliminar_ss_permisos';
import { ActualizarSsPermisosDto } from '../../../dtos/requests/Servicio Social/Permisos/actualizar_ss_permisos.dto';
import { ActualizarSsPermisosUseCase } from '../../logic/servicio_Social/Permisos/actualizar_ss_permisos';

@ApiTags('Servicio Social - Permisos')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('servicio-social/permisos')
export class SsPermisosController {

  constructor(
    private readonly obtenerSsPermisosUseCase: ObtenerSsPermisos,
    private readonly crearSsPermisosUseCase: CrearSsPermisosUseCase,
    private readonly eliminarSsPermisosUseCase: EliminarSsPermisosUseCase,
    private readonly actualizarSsPermisosUseCase: ActualizarSsPermisosUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  @ApiResponse({ status: 200, description: 'Lista de permisos obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron permisos' })
  async ObtenerTodos() {
    return this.obtenerSsPermisosUseCase.ObtenerTodos();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener permiso por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del permiso' })
  @ApiResponse({ status: 200, description: 'Permiso encontrado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  async ObtenerPorId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.obtenerSsPermisosUseCase.ObtenerPorId(id);
  }

  @Get('nombre/:permiso')
  @ApiOperation({ summary: 'Obtener permisos por nombre' })
  @ApiParam({ name: 'permiso', type: String, description: 'Nombre del permiso a buscar' })
  @ApiResponse({ status: 200, description: 'Permisos encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron permisos con ese nombre' })
  async ObtenerPorNombrePermiso(
    @Param('permiso') permiso: string
  ) {
    return this.obtenerSsPermisosUseCase.ObtenerPorNombrePermiso(permiso);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo permiso' })
  @ApiBody({ type: CrearSsPermisosDto })
  async Crear(@Body() dto: CrearSsPermisosDto) {
    return this.crearSsPermisosUseCase.Ejecutar(dto);
  }
  
  @Delete('id/:id')
  @ApiOperation({ summary: 'Eliminar un permiso por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del permiso a eliminar' })
  @ApiResponse({ status: 200, description: 'Permiso eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  async Eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.eliminarSsPermisosUseCase.Ejecutar(id);
    return { 
      statusCode: 200,
      message: `El permiso con id ${id} fue eliminado correctamente.` 
    };
  }
  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar un permiso por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del permiso a actualizar' })
  @ApiBody({ type: ActualizarSsPermisosDto })
  @ApiResponse({ status: 200, description: 'Permiso actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Permiso no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto: Ya existe un permiso con ese nombre' })
  async Actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSsPermisosDto
  ) {
    return this.actualizarSsPermisosUseCase.Ejecutar(id, dto);
  }

}