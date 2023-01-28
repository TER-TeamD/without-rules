import { Injectable } from '@nestjs/common';

@Injectable()
export class EngineUtilsService {




    static shuffle(array: any[]): any[] {
        array = array.sort(() => Math.random() - 0.5);
        array = array.sort(() => Math.random() - 0.5);
        return array
    }
}
