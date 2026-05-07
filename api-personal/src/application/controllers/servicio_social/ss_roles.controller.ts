import { Controller, Get, Post, Param, Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from '../../../infrastructure/security/auth/Jwt.guard';
import { ObtenerSsRoles } from '../../logic/servicio_Social/Roles/obtener_ss_roles';
import { CrearSsRolesUseCase } from '../../logic/servicio_Social/Roles/crear_ss_roles';
import { CrearSsRolesDto } from '../../../dtos/requests/Servicio Social/Roles/crear_ss_roles.dto';
import { EliminarSsRolesUseCase } from '../../logic/servicio_Social/Roles/eliminar_ss_roles';
import { ActualizarSsRolesUseCase } from '../../logic/servicio_Social/Roles/actualizar_ss_roles';
import { ActualizarSsRolesDto } from '../../../dtos/requests/Servicio Social/Roles/actualizar_ss_roles.dto';

@ApiTags('Servicio Social - Roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('servicio-social/roles')
export class SsRolesController {

  constructor(
    private readonly obtenerSsRolesUseCase: ObtenerSsRoles,
    private readonly crearSsRolesUseCase: CrearSsRolesUseCase,
    private readonly eliminarSsRolesUseCase: EliminarSsRolesUseCase,
    private readonly actualizarSsRolesUseCase: ActualizarSsRolesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({ status: 200, description: 'Lista de roles obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron roles' })
  async ObtenerTodos() {
    return this.obtenerSsRolesUseCase.ObtenerTodos();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener rol por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del rol' })
  @ApiResponse({ status: 200, description: 'Rol encontrado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async ObtenerPorId(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.obtenerSsRolesUseCase.ObtenerPorId(id);
  }

  @Get('nombre/:rol')
  @ApiOperation({ summary: 'Obtener roles por nombre' })
  @ApiParam({ name: 'rol', type: String, description: 'Nombre del rol a buscar' })
  @ApiResponse({ status: 200, description: 'Roles encontrados correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'No se encontraron roles con ese nombre' })
  async ObtenerPorNombreRol(
    @Param('rol') rol: string
  ) {
    return this.obtenerSsRolesUseCase.ObtenerPorNombreRol(rol);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiBody({ type: CrearSsRolesDto })
  @ApiResponse({ status: 201, description: 'Rol creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre' })
  async Crear(@Body() dto: CrearSsRolesDto) {
    return this.crearSsRolesUseCase.Ejecutar(dto);
  }
  
  @Delete('id/:id')
  @ApiOperation({ summary: 'Eliminar un rol por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del rol a eliminar' })
  @ApiResponse({ status: 200, description: 'Rol eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async Eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.eliminarSsRolesUseCase.Ejecutar(id);
    return { 
      statusCode: 200,
      message: `El rol con id ${id} fue eliminado correctamente.` 
    };
  }

  @Put('id/:id')
  @ApiOperation({ summary: 'Actualizar rol por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Id del rol a actualizar' })
  @ApiBody({ type: ActualizarSsRolesDto })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un rol con ese nombre' })
  async Actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarSsRolesDto
  ) {
    return this.actualizarSsRolesUseCase.Ejecutar(id, dto);
  }
}