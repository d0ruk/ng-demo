/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
  hot: any;
}

declare module "*.png" {
  const content: any;
  export default content;
}