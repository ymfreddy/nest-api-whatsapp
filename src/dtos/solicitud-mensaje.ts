import { IsString } from 'class-validator';

export class SolicitudMensajeDto {

    @IsString()
    readonly phone: string;

    @IsString()
    readonly message: string;

}