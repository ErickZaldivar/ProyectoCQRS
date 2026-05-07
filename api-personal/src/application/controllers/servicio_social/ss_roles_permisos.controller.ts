import { Controller, Get, Post, Put, Param, Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from '../../../infrastructure/security/auth/Jwt.guard';
import { ObtenerSsRolesPermisosUseCase } from '../../logic/servicio_Social/Roles_Permisos/obtener_ss_roles_permisos';
import { CrearSsRolPermisoUseCase } from '../../logic/servicio_Social/Roles_Permisos/craer_ss_roles_permisos';
import { CrearSsRolPermisoDto } from '../../../dtos/requests/Servicio Social/Roles_Permisos/crear_ss_roles_permisos.dto';
import { EliminarSsRolesPermisosUseCase } from '../../logic/servicio_Social/Roles_Permisos/eliminar_ss_roles_permisos';
import { ActualizarSsRolPermisoUseCase } from '../../logic/servicio_Social/Roles_Permisos/actualizar_ss_roles_permisos.use.case';
import { ActualizarSsRolPermisoDto } from '../../../dtos/requests/Servicio Social/Roles_Permisos/actualizar_ss_roles_permisos.dto';

@ApiTags('Servicio Social - Roles Permisos')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('servicio-social/roles-permisos')
export class SsRolesPermisosController {

  constructor(
    private readonly obtenerSsRolesPermisosUseCase: ObtenerSsRolesPermisosUseCase,
    private readonly crearSsRolPermisoUseCase: CrearSsRolPermisoUseCase,
    private readonly eliminarSsRolesPermisosUseCase: EliminarSsRolesPermisosUseCase,
    private readonly actualizarSsRolPermisoUseCase: ActualizarSsRolPermisoUseCase, 
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles con sus permisos' })
  @ApiResponse({ status: 200, description: 'Lista de roles permisos obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron roles con permisos' })
  async ObtenerTodos() {
    return this.obtenerSsRolesPermisosUseCase.ObtenerTodos();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener rol-permiso por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del rol-permiso' })
  @ApiResponse({ status: 200, description: 'Rol-permiso encontrado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Rol-permiso no encontrado' })
  async ObtenerPorId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.obtenerSsRolesPermisosUseCase.ObtenerPorId(id);
  }

  @Get('rol/:idRol')
  @ApiOperation({ summary: 'Obtener permisos por rol' })
  @ApiParam({ name: 'idRol', type: Number, description: 'Id del rol' })
  @ApiResponse({ status: 200, description: 'Permisos del rol obtenidos correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron permisos para ese rol' })
  async ObtenerPorRol(
    @Param('idRol', ParseIntPipe) idRol: number
  ) {
    return this.obtenerSsRolesPermisosUseCase.ObtenerPorRol(idRol);
  }

  @Get('permiso/:idPermiso')
  @ApiOperation({ summary: 'Obtener roles por permiso' })
  @ApiParam({ name: 'idPermiso', type: Number, description: 'Id del permiso' })
  @ApiResponse({ status: 200, description: 'Roles del permiso obtenidos correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron roles para ese permiso' })
  async ObtenerPorPermiso(
    @Param('idPermiso', ParseIntPipe) idPermiso: number
  ) {
    return this.obtenerSsRolesPermisosUseCase.ObtenerPorPermiso(idPermiso);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva relación rol-permiso' })
  @ApiBody({ type: CrearSsRolPermisoDto })
  @ApiResponse({ status: 201, description: 'Relación rol-permiso creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Ya existe esa relación rol-permiso' })
  async Crear(
    @Body() dto: CrearSsRolPermisoDto
  ) {
    return this.crearSsRolPermisoUseCase.Ejecutar(dto);
  }
  @Delete('id/:id')
  @ApiOperation({ summary: 'Eliminar una asignación de rol-permiso por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la asignación a eliminar' })
  @ApiResponse({ status: 200, description: 'Asignación eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  async Eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.eliminarSsRolesPermisosUseCase.Ejecutar(id);
    return { 
      statusCode: 200,
      message: `La asignación con id ${id} fue eliminada correctamente.` 
    };
  }

  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar una asignación rol-permiso por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la asignación a actualizar' })
  @ApiBody({ type: ActualizarSsRolPermisoDto })
  @ApiResponse({ status: 200, description: 'Asignación actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe esa relación rol-permiso' })
  async Actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSsRolPermisoDto
  ) {
    return this.actualizarSsRolPermisoUseCase.Ejecutar(id, dto);
  }
}