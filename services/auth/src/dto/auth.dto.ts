export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  dateOfBirth: Date;
    name: any;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
} 

function IsEmail(): (target: RegisterDto, propertyKey: "email") => void {
    throw new Error("Function not implemented.");
}
