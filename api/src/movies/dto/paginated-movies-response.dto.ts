import { MovieResponseDto } from './movie-response.dto';
import { PaginatedResponseDto } from '../../common/dtos/paginated-response.dto';

export class PaginatedMoviesResponseDto extends PaginatedResponseDto<MovieResponseDto> {}
