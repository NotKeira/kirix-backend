export default class StringValidator {
  private static test(value: string, regex: RegExp): boolean {
    return regex.exec(value) !== null;
  }
  static isString(value: any): boolean {
    return typeof value === "string";
  }

  static isNotEmpty(value: string): boolean {
    return value.length > 0;
  }

  static isLengthBetween(value: string, min: number, max: number): boolean {
    return value.length >= min && value.length <= max;
  }

  static isLength(value: string, length: number): boolean {
    return value.length === length;
  }

  static isEmail(value: string): boolean {
    return this.test(value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  static isPassword(value: string): boolean {
    return this.test(value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
  }

  static isUsername(value: string): boolean {
    return this.test(value, /^[a-zA-Z0-9_]{3,}$/);
  }

  static isPhone(value: string): boolean {
    return this.test(value, /^[0-9]{10,}$/);
  }

  static isAlpha(value: string): boolean {
    return this.test(value, /^[a-zA-Z]+$/);
  }

  static isAlphaNumeric(value: string): boolean {
    return this.test(value, /^[a-zA-Z0-9]+$/);
  }

  static isNumeric(value: string): boolean {
    return this.test(value, /^[0-9]+$/);
  }

  static isDecimal(value: string): boolean {
    return this.test(value, /^[0-9]+\.[0-9]+$/);
  }

  static isHex(value: string): boolean {
    return this.test(value, /^[0-9a-fA-F]+$/);
  }

  static isBase64(value: string): boolean {
    return this.test(value, /^[a-zA-Z0-9/+]+={0,2}$/);
  }

  static isJSON(value: string): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  static isURL(value: string): boolean {
    return this.test(value, /^(http|https):\/\/[^ "]+$/);
  }

  static containsSQL(value: string): boolean {
    return this.test(
      value,
      /select|insert|update|delete|drop|alter|create|database|table|exec/i
    );
  }

  static containsHTML(value: string): boolean {
    return this.test(value, /<[^>]*>/i);
  }

  static containsScript(value: string): boolean {
    return this.test(value, /<script[^>]*>/i);
  }
  static containsDangerous(value: string): boolean {
    return this.test(
      value,
      /<script[^>]*>|select|insert|update|delete|drop|alter|create|database|table|exec/i
    );
  }

  static containsSpaces(value: string): boolean {
    return this.test(value, /\s/);
  }
}
