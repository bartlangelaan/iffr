export interface TTUserContactRecord {
  Id: string;
  Type: 'Email' | 'Home';
}

enum TTLanguageID {
  English = 1033,
  Dutch = 1043,
}

export interface TTMultilanguageString {
  LCID: TTLanguageID;
  Text: string;
}

export interface TTUserAddressRecord {
  Address: {
    CityName: {
      GSEntry: TTMultilanguageString[];
    };
    CountryName: {
      GSEntry: TTMultilanguageString[];
    };
    FormattedForDisplay: string;
  };
}

export default interface TTUserSummary {
  client: {
    Name: {
      Prefix: string | null;
      First: string | null;
      Middle: string | null;
      Last: string | null;
      Initials: string | null;
    };
    Gender: 'Male';
    IsUnconfirmed: false;
    ContactDetails: {
      Record: TTUserContactRecord[];
    };
    CrmId: string;
    WorkPlace: null;
    Id: string;
    AddressDetails: {
      Record: TTUserAddressRecord[];
    };
    Login: {
      Name: string;
      Password: null;
    };
    PreferredCultureId: string;
    LocalId: number;
    AccessPermissions: 'All';
    CreationDateTime: string;
    OrganizationUnitId: '10000000-0000-0000-0000-000000000001';
    Status: {
      Status: 'Active';
    };
    Type: 'Customer';
    IsDeceased: false;
    IsHouseholdRepresentative: true;
  };
}
