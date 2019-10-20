import { writeSync } from 'fs';
import { format } from 'util';

function consoleErrorSync(data: any, ...args: any[]) {
    writeSync(
        2,
        format(data, ...args) + '\n',
    );
}

export default consoleErrorSync;
export { consoleErrorSync };