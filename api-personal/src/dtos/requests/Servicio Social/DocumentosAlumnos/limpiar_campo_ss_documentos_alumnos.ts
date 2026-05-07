import { IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type CampoDocumento = 'carta_presentacion' | 'carta_compromiso' | 'carta_aceptacion' | 'seguro_facultativo';

export class LimpiarCampoSsDocumentosAlumnosDto {
  @ApiProperty({
    example: 'carta_presentacion',
    description: 'Nombre del campo de documento a limpiar',
    enum: ['carta_presentacion', 'carta_compromiso', 'carta_aceptacion', 'seguro_facultativo']
  })
  @IsString()
  @IsIn(['carta_presentacion', 'carta_compromiso', 'carta_aceptacion', 'seguro_facultativo'])
  campo: CampoDocumento;
}