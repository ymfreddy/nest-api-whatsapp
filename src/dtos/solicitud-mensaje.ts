import { IsString } from 'class-validator';

export class SolicitudMensajeDto {

    @IsString()
    readonly phone: string;

    @IsString()
    readonly message: string;

    readonly media: MediaFile;
}

export class MediaFile {

    @IsString()
    readonly data: string;

    @IsString()
    readonly mimeType: string;

    @IsString()
    readonly fileName?: string;  
}

export class SolicitudMensajeMediaDto {

    @IsString()
    readonly phone: string;

    @IsString()
    readonly data: string;

    @IsString()
    readonly mimeType: string;

    @IsString()
    readonly fileName?: string;  
}
