import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class UpdateWatchCatalogDto {
  @ApiProperty()
  brand: string;

  @ApiProperty()
  reference_number: string;

  @ApiProperty()
  retail_price: number;

  @ApiProperty()
  @IsDateString()
  release_date: string;

  @ApiProperty()
  origin_country: string;
}
