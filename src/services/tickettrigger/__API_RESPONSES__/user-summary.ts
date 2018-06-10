export interface TTUserContactRecord {
  Id: string;
  Type: 'Email' | 'Home' | 'Mobile';
  Detail: string;
}

enum TTLanguageID {
  English = 1033,
  Dutch = 1043,
}

export interface TTMultilanguageString {
  LCID: TTLanguageID;
  Text: string;
}

export interface TTUserRelatedClientsRecord {
  ClientId: string;
  ClientType: 'Customer';
  RelationshipId: string;
  RelationshipRoleId: string;
  RelationshipTypeId: string;
}

export interface TTUserAddressRecord {
  Address: {
    AddressLine1: string; // Street name (Coolsingel)
    AddressLine2: string; // House number (1A)
    CityName: {
      GSEntry: TTMultilanguageString[];
    };
    CountryName: {
      GSEntry: TTMultilanguageString[];
    };
    ZipCode: string | null; // Can contain spaces.
    FormattedForDisplay: string;
  };
}

export interface TTUserClientTypeRecord {
  Id: string;
  IsDynamic: boolean;
  TypeId: string;
  TypeName: {
    GSEntry: TTMultilanguageString[];
  };
  TypeOrdinal: number;
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
    Gender: 'Male' | 'Female';
    ClientTypes: {
      Record: TTUserClientTypeRecord[];
    };
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
    RelatedClients: {
      Record: TTUserRelatedClientsRecord[];
    };
    LocalId: number;
    AccessPermissions: 'All';
    CreationDateTime: string;
    OrganizationUnitId: '10000000-0000-0000-0000-000000000001';
    Status: {
      Status: 'Active';
    };
    Type: 'Customer';
    Birthday?: string;
    IsDeceased: false;
    IsHouseholdRepresentative: true;
  };
  clientImage: null | {
    ImageExtension: string;
    ImageUrl: string;
  };
}
