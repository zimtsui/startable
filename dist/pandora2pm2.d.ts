import { Service } from './autonomous';
interface ServiceCtor {
    new (): Service;
}
declare function pandora2Pm2(Services: ServiceCtor[]): Promise<void>;
export default pandora2Pm2;
export { pandora2Pm2 };
