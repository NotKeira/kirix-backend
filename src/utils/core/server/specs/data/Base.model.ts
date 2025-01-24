export abstract class BaseService {
  abstract execute(
    data: Record<string, any>
  ):
    | any
    | Promise<any>
    | void
    | Promise<void>
    | string
    | Promise<string>
    | Record<string, any>
    | Promise<Record<string, any>>;
}
