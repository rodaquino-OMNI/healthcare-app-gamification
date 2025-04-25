import { ApiProperty } from '@nestjs/swagger';

export class <%= className %>Dto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00Z'
  })
  updatedAt: Date;
}