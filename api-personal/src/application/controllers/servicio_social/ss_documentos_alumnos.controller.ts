import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';

import { JwtGuard } from '../../../infrastructure/security/auth/Jwt.guard';

import { ObtenerSsDocumentosAlumnos } from '../../logic/servicio_Social/DocumentosAlumnos/obtener_ss_documentos_alumnos';
import { CrearSsDocumentosAlumnosUseCase } from '../../logic/servicio_Social/DocumentosAlumnos/crear_ss_documentos_alumnos';
import { CrearSsDocumentosAlumnosDto } from '../../../dtos/requests/Servicio Social/DocumentosAlumnos/crear_ss_documentos_alumnos.dto';
import { Response } from 'express';
import { EliminarSsDocumentosAlumnosUseCase } from '../../logic/servicio_Social/DocumentosAlumnos/eliminar_ss_documentos_alumnos';
import { ActualizarSsDocumentosAlumnosUseCase } from '../../logic/servicio_Social/DocumentosAlumnos/actualizar_ss_documentos_alumnos.use.case';
import { ActualizarSsDocumentosAlumnosDto } from '../../../dtos/requests/Servicio Social/DocumentosAlumnos/actualizar_ss_documentos_alumnos.dto';
import { LimpiarCampoSsDocumentosAlumnosUseCase } from '../../logic/servicio_Social/DocumentosAlumnos/limpiar_campo_ss_documentos_alumnos';
import { LimpiarCampoSsDocumentosAlumnosDto } from '../../../dtos/requests/Servicio Social/DocumentosAlumnos/limpiar_campo_ss_documentos_alumnos';
import { SsDocumentosAlumnosPresenter } from '../../presenters/servicio_social/ss_documentos_alumnos.presenter';

@ApiTags('Servicio Social - Documentos Alumnos')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('servicio-social/documentos-alumnos')
export class SsDocumentosAlumnosController {

  constructor(
    private readonly obtenerSsDocumentosAlumnosUseCase: ObtenerSsDocumentosAlumnos,
    private readonly crearSsDocumentosAlumnosUseCase: CrearSsDocumentosAlumnosUseCase,
    private readonly eliminarSsDocumentosAlumnosUseCase: EliminarSsDocumentosAlumnosUseCase,
    private readonly actualizarSsDocumentosAlumnosUseCase: ActualizarSsDocumentosAlumnosUseCase,
    private readonly limpiarCampoSsDocumentosAlumnosUseCase: LimpiarCampoSsDocumentosAlumnosUseCase,
  ) {}

  private validarArchivo(file: Express.Multer.File) {

    // Validar tamaño máximo 2MB
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException(
        'El archivo excede el tamaño máximo permitido de 2MB',
      );
    }

    // Validar MIME type
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Solo se permiten archivos PDF',
      );
    }

    // Validar extensión
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      throw new BadRequestException(
        'La extensión del archivo debe ser .pdf',
      );
    }

    // Validar firma binaria PDF (%PDF)
    const header = file.buffer.toString('utf8', 0, 4);

    if (header !== '%PDF') {
      throw new BadRequestException(
        'El archivo no es un PDF válido',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de documentos' })
  @ApiResponse({ status: 200 })
  async ObtenerTodos() {
    return this.obtenerSsDocumentosAlumnosUseCase.ObtenerTodos();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener documentos por id del registro' })
  async ObtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorId(id);
  }

  @Get('alumno/:id_alumno')
  @ApiOperation({ summary: 'Obtener documentos por alumno' })
  async ObtenerPorIdAlumnoAcademico(
    @Param('id_alumno', ParseIntPipe) id_alumno: number,
  ) {
    return this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorIdAlumnoAcademico(id_alumno);
  }

  @Get('plan-trabajo/:id_plan_trabajo')
  async ObtenerPorIdPlanTrabajo(
    @Param('id_plan_trabajo', ParseIntPipe) id_plan_trabajo: number,
  ) {
    return this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorIdPlanTrabajo(id_plan_trabajo);
  }

  @Get('ver-carta-presentacion/:id')
  async VerCartaPresentacion(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const registro = await this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorId(id);

    if (!registro?.carta_presentacion) {
      return res.status(404).send('No encontrado');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    });

    return res.send(registro.carta_presentacion);
  }

  @Get('ver-carta-compromiso/:id')
  async VerCartaCompromiso(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const registro = await this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorId(id);

    if (!registro?.carta_compromiso) {
      return res.status(404).send('No encontrado');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    });

    return res.send(registro.carta_compromiso);
  }

  @Get('ver-carta-aceptacion/:id')
  async VerCartaAceptacion(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const registro = await this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorId(id);

    if (!registro?.carta_aceptacion) {
      return res.status(404).send('No encontrado');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    });

    return res.send(registro.carta_aceptacion);
  }

  @Get('ver-seguro-facultativo/:id')
  async VerSeguro(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const registro = await this.obtenerSsDocumentosAlumnosUseCase.ObtenerPorId(id);

    if (!registro?.seguro_facultativo) {
      return res.status(404).send('No encontrado');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    });

    return res.send(registro.seguro_facultativo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir documentos PDF seguros' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'carta_presentacion', maxCount: 1 },
        { name: 'carta_compromiso', maxCount: 1 },
        { name: 'carta_aceptacion', maxCount: 1 },
        { name: 'seguro_facultativo', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: 2 * 1024 * 1024,
        },
      },
    ),
  )
  async Crear(
    @Body() dto: CrearSsDocumentosAlumnosDto,

    @UploadedFiles()
    files: {
      carta_presentacion?: Express.Multer.File[];
      carta_compromiso?: Express.Multer.File[];
      carta_aceptacion?: Express.Multer.File[];
      seguro_facultativo?: Express.Multer.File[];
    },
  ) {

    Object.values(files || {}).forEach((arr) => {
      arr?.forEach((file) => this.validarArchivo(file));
    });

    return this.crearSsDocumentosAlumnosUseCase.Ejecutar(dto, files);
  }

  @Delete('id/:id')
  @ApiOperation({ summary: 'Eliminar registro completo' })
  async Eliminar(
    @Param('id', ParseIntPipe) id: number,
  ) {

    await this.eliminarSsDocumentosAlumnosUseCase.Ejecutar(id);

    return {
      statusCode: 200,
      message: `Registro ${id} eliminado`,
    };
  }

  @Put('id/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar documentos PDF seguros' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'carta_presentacion', maxCount: 1 },
        { name: 'carta_compromiso', maxCount: 1 },
        { name: 'carta_aceptacion', maxCount: 1 },
        { name: 'seguro_facultativo', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: 2 * 1024 * 1024,
        },
      },
    ),
  )
  async Actualizar(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: ActualizarSsDocumentosAlumnosDto,

    @UploadedFiles()
    files: {
      carta_presentacion?: Express.Multer.File[];
      carta_compromiso?: Express.Multer.File[];
      carta_aceptacion?: Express.Multer.File[];
      seguro_facultativo?: Express.Multer.File[];
    },
  ) {

    Object.values(files || {}).forEach((arr) => {
      arr?.forEach((file) => this.validarArchivo(file));
    });

    const result =
      await this.actualizarSsDocumentosAlumnosUseCase.Ejecutar(
        id,
        dto,
        files,
      );

    return SsDocumentosAlumnosPresenter.Presentar(result);
  }

  @Patch('limpiar-campo/:id')
  @ApiOperation({
    summary: 'Limpiar un campo de documento individual',
  })
  @HttpCode(HttpStatus.OK)
  async LimpiarCampo(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: LimpiarCampoSsDocumentosAlumnosDto,
  ) {

    await this.limpiarCampoSsDocumentosAlumnosUseCase.Ejecutar(id, dto);

    return {
      statusCode: 200,
      message: `Campo '${dto.campo}' eliminado correctamente del registro ${id}`,
    };
  }
}