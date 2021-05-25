import { Entity } from "./entity";

export class Messages {
  public static get SMS_NOT_FOUND(): string { return "Not result"; }
  public static get SMS_NOT_AUTHORIZED(): string { return "Not Authorized"; }
  public static get SMS_DEFAULT_ERROR(): string { return "Something goes wrong!"; }

  public static ALREADY_EXIST(entity:Entity): string { return entity + " already exist!"; }
  public static ALREADY_IN_USE(entity:Entity): string { return entity + " already in use!"; }
  public static CREATED(entity:Entity): string { return entity + " created!"; }
  public static UPDATED(entity:Entity): string { return entity + " updated!"; }
  public static DELETED(entity:Entity): string { return entity + " deleted!"; }
  public static NOT_FOUND(entity:Entity): string { return entity + " Not found!"; }

}
