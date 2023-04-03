
export interface Location {
    country: string;
    state: string;
    city: string;
    zipCode: string;
}

export interface SearchCritera {
    specialty?: string;
    service?: string;
    country?: string;
    state?: string;
    city?: string;
    zipCode?: string;
    insurance?: string;
    mode?: 'basic' | 'advanced';
    name?: string;
}

export function toSearchTerm(data: any): SearchCritera {
    let criteria: SearchCritera = {};
    criteria.specialty = data['specialty'];
    criteria.service = data['service'];
    criteria.country = data['country'];
    criteria.state = data['state'];
    criteria.city = data['city'];
    criteria.zipCode = data['zipCode'];
    criteria.insurance = data['insurance'];
    criteria.mode = data['mode'];
    criteria.name = data['name'];
    criteria = removeUndefinedOrNullFields(criteria);
    return criteria;
}

export function removeUndefinedOrNullFields(obj: any): any {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === 'null' || obj[key] === null || obj[key] === '' || obj[key] < 1) {
            delete obj[key];
        }
    });

    return obj;
}

export const cleanEmpty = obj => {
    if (Array.isArray(obj)) {
      return obj
          .map(v => (v && typeof v === 'object') ? cleanEmpty(v) : v)
          .filter(v => !(v == null));
    } else {
      return Object.entries(obj)
          .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
          .reduce((a, [k, v]) => (v == null || v === '' ? a : {...a, [k]: v}), {});
    }
  }

export function getOffset(page: number, size: number): number {
    let offset;
    if (page == 0) {
        offset = 0;
    }
    // if (page == 1) {
    //     offset = (page - 1) * size;
    // }
    if (page >= 1) {
        offset = (page - 1) * size;
    }
    return offset;
}

export enum AdvancedFilterTabEnum {
    all = 'all',
    doctors = 'doctors',
    offices = 'office',
    promotions = 'promotions',
    insurance = 'insurance',
    services = 'services'
}

export enum SearchMode {
    basic = 'basic',
    advanced = 'advanced'
}

export enum ViewMode {
  table = 'table',
  grid = 'grid'
}

export const MAX_PAGE_SIZE = 5;
