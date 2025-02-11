// updateUser dto
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  discord_id?: string;

  @IsOptional()
  @IsString()
  discord_username?: string;

  @IsOptional()
  @IsBoolean()
  is_staked_to_sidan?: string;

  @IsOptional()
  @IsBoolean()
  is_drep_delegated_to_sidan?: string;

  @IsOptional()
  @IsString()
  wallet_address?: string;

  @IsOptional()
  @IsString()
  stake_key_lovelace?: string;
}
