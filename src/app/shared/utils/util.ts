/*!
 * accepts
 * Copyright(c) 2021 nipusan
 * MIT Licensed
 */

export class Util {

  /**
   * Check it has data and returns a boolean
   *
   * @param x data to validate
   * @returns boolean
   */
  static check(x: any): boolean {

    // null data check
    if (x == null) {
      return false;
    } else if (x === null) {
      return false;

      // undefined data check
    } else if (typeof x === 'undefined') {
      return false;
    } else if (x === '') {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Verify that the object or none of its fields are null
   *
   * @param x Object to validate
   * @returns boolean
   */
  static checkObject(x: any): boolean {

    // null data check
    if (!this.check(x)) {
      return false;

      // validate if it has properties
    } else if (Object.keys(x).length === 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * checks the object and its fields and returns true if all data passed the check
   *
   * @param x Object to validate
   * @param fields Object fields to validate
   * @returns boolean
   */
  static checkObjectAndItsFields(x: any, fields: string[]): boolean {

    // validate if it has properties
    if (Object.keys(x).length === 0) {
      return false;
    } else {

      // validate if it has the properties defined in fields
      fields.forEach(element => {
        Object.keys(x).some(some => element === some);
      });
      return true;
    }
  }

  /**
   * validates the list and returns true if all data in the list passed the check
   *
   * @param x List to validate
   * @returns boolean
   */
  static checkList(x: any): boolean {

    // check that the list is not empty
    if (x.length === 0) {
      return false;
    } else if (this.check(x)) {
      return true;
    }
    return false;
  }

  /**
   * validate the data and print the response to the console
   *
   * @param x Data to validate
   * @returns  boolean
   */
  static checkAndLog(x: any): boolean {
    const r = this.check(x);
    if (r) {
      console.log('validation was true');
    } else {
      console.log('validation was false');
    }
    return r;
  }

  /**
   * return 0, if the two variables are not null or undefined.
   * return 1, if the first variable is null or undefined.
   * return 2, if the second variable is null or undefined.
   * return 3, if both variables are null or undefined.
   *
   * @param x Data to validate
   * @param y Data to validate
   * @returns number
   */
  static checkAndReturnANumber(x: any, y: any): number {
    if (this.check(x) && this.check(y)) {
      return 0;
    } else if (this.check(x)) {
      return 1;
    } else if (this.check(y)) {
      return 2;
    } else {
      return 3;
    }
  }

}
