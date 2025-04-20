import { FormikErrors } from "formik";
export interface ProductModel {
    id?: string;
    title: string | undefined;
    subtitle: string | undefined;
    material?: string | undefined;
    description: string | undefined;
    discountable: boolean;
    type?: string | undefined;
    tags?: Array<string | undefined>;
    variants?: object | undefined;
    price: number | undefined;
    deliveryPrice?: number | undefined;
    thumbnail?: File | undefined;
    media?: Array<File | undefined>;
}
export interface ProductCategoryModel {
    id: string;
    title: string | undefined;
    description: string | undefined;
}
export type EmailPassword = {
    email: string;
    password: string;
};
export type SignUpPayloads = {
    email: string;
    password: string;
    name?: string;
    invite?: Partial<MembersType>;
};
export type ProductParams = {
    productId: string;
};
export type SetFieldValue<T = unknown> = (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<T>>;
export interface EventType {
    id: string;
    collectionId: string;
    collectionName: string;
    title: string;
    description: string;
    slug: string;
    length: number;
    bufferTimeBefore: number | null;
    bufferTimeAfter: number | null;
    minimumNotice: number;
    minimumNoticeType: string;
    hidden: boolean;
    location: string;
    timeSlots: number[];
    team: string;
    user: Array<string | undefined>;
    active: boolean;
    created: string;
    updated: string;
    expand: {
        members: Array<MembersType>;
        team: Team;
    };
    members?: Array<MembersType>;
    event_type_settings_via_event_type: EventTypeSettings[];
    created_by_user: string;
    overrideAll: boolean;
    lockedFields?: Array<string>;
    bookingQuestions: Array<any>;
    defaultDuration?: number | string;
    organization: string;
    type: EventTypeType;
}
export type EventTypeType = "managed" | "round_robin" | "recurring";
export type User = {
    collectionId: string;
    collectionName: string;
    created: string;
    email: string;
    emailVisibility: boolean;
    id: string;
    name: string;
    updated: string;
    username: string;
    verified: boolean;
    avatar: string;
    timezone: string;
    bio: string;
    theme: string;
    weekStart: string;
};
export type MembersType<OrgMembership = OrganizationMembership, Expanded = {
    teams_via_members?: Array<Team>;
    user?: User;
    organization_membership?: OrganizationMembership;
    organization?: Organization;
    event_types_via_members: EventType[];
    event_type_settings_via_member: EventTypeSettings[];
}> = {
    id: string;
    full_name: string;
    email: string;
    bio: string;
    role: string;
    status: "pending" | "completed" | "failed";
    token: string;
    expire_date: string;
    used: boolean;
    organization: string;
    expand: Expanded;
    invited_by: string;
    created: string;
    updated: string;
    user?: User;
    organization_membership: OrgMembership;
};
export type OrganizationMembership = {
    collectionId: string;
    collectionName: string;
    created: string;
    id: string;
    organization: string;
    role: string;
    updated: string;
    user: string;
    expand: {
        user: User;
        organization: Organization;
    };
};
export type Organization = {
    collectionId: string;
    collectionName: string;
    created: string;
    expand: {
        organization_membership: OrganizationMembership[];
    };
    role?: UserRoles;
    id: string;
    logo: string;
    name: string;
    settings: any;
    slug: string;
    updated: string;
    user: string;
    description: string;
};
export type TeamType = {
    id: string;
    name: string;
    slug: string;
    description: string;
    organization: Organization;
    members: MembersType[];
    created: string;
    updated: string;
};
export type EventTypeFormResponse = {
    active: boolean;
    bufferTimeAfter: number;
    bufferTimeBefore: number;
    collectionId: string;
    collectionName: string;
    created: string;
    created_by_user: string;
    description: string;
    hidden: boolean;
    id: string;
    length: number;
    location: string;
    members: string[];
    minimumNotice: number;
    minimumNoticeType: "weeks" | "days" | "hours";
    organization: string;
    slug: string;
    team: string;
    timeSlots: number[];
    title: string;
    updated: string;
};
export type EventTypeSettings = {
    id: string;
    event_type: string;
    expand: {
        event_type: EventType;
        user: User;
        member: MembersType;
    };
    user: string;
    settings: EventType;
    member: string;
};
export type UserRoles = "admin" | "member" | "owner";
export type Webhooks = {
    id: string;
    url: string;
    event_types: Array<string>;
    events: Array<string>;
    secret: string;
    active: boolean;
    isDeleted: boolean;
    created_by: User;
    created: string;
    updated: string;
};
export type Team = {
    id: string;
    name: string;
    slug: string;
    organization: string;
    description: string;
    members: Array<MembersType | string>;
};
export type Availability = {
    id: number;
    name: string;
    availability: {
        start: string;
        end: string;
        user?: string;
    }[][];
    timezone: string;
    isDefault: boolean;
    isLastSchedule: boolean;
    readOnly: boolean;
    isActive: boolean;
    incrementStep: number;
    isManaged: boolean;
    dateOverrides: DateOverrides[];
    expand: {
        user: User;
    };
    user: string;
};
export type DateOverrides = {
    availability: {
        start: string;
        end: string;
    }[];
    date: string;
};
export type QuestionType = "text" | "textarea" | "dropdown" | "multipleChoice" | "checkbox" | "number" | "phone" | "email";
export interface BookingQuestionOption {
    id: string;
    value: string;
}
export interface BookingQuestionType {
    id: string;
    type: QuestionType;
    label: string;
    required: boolean;
    placeholder?: string;
    options?: BookingQuestionOption[];
    identifier?: string;
    disableIfPrefilled?: boolean;
    platformMandatory?: boolean;
}
export type Booking = {
    attendees: Array<{
        email: string;
        name: string;
        host: boolean;
    }>;
    cancelReason: string;
    collectionId: string;
    collectionName: string;
    created: string;
    description: string;
    endTime: string;
    eventType: string;
    id: string;
    location: string;
    recurring: boolean;
    responses: object;
    startTime: string;
    status: "confirmed" | "cancelled" | "unconfirmed" | "rescheduled";
    title: string;
    updated: string;
    user: string;
    expand: {
        availability_via_user: Availability;
    };
    duration: number;
    rescheduledBy: string;
    meetingStartTime: string;
};
export type PaginatedResponse<T> = {
    items: Array<T>;
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
};
export type Guest = {
    email: string;
    name: string;
    host: boolean;
};
export type Slot = {
    formattedTime: string;
    utcTime: Date;
    user: string | undefined;
    users?: string[];
};
