export interface MediaModel {
    title: string;
    subtitle: string;
    description: string;
    previewImg: string;
    media?: MediaModel.Media;
}

export namespace MediaModel {
    export interface Media {
        url: string;
        type: string;
    }
}
