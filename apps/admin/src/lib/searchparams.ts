import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

import { userRoles } from "../../../../packages/db/src";

export const searchParams = {
  category: parseAsString,
  email: parseAsString,
  name: parseAsString,
  page: parseAsInteger.withDefault(1),
  payment_status: parseAsString,
  perPage: parseAsInteger.withDefault(10),
  q: parseAsString,
  roles: parseAsArrayOf(parseAsStringEnum(userRoles.enumValues)),
  status: parseAsString,
  type: parseAsString,
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
