import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Allow empty values (for optional fields)

          // Check if it's a string
          if (typeof value !== 'string') return false;

          // Check if it starts with data:image/
          const base64ImagePattern =
            /^data:image\/(jpeg|jpg|png|gif|bmp|webp);base64,/;
          if (!base64ImagePattern.test(value)) return false;

          // Extract base64 part
          const base64Data = value.split(',')[1];
          if (!base64Data) return false;

          // Validate base64 format
          const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
          return base64Pattern.test(base64Data);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid base64 image string (data:image/[type];base64,[data])`;
        },
      },
    });
  };
}
