export interface BlogsResponse {
    success: boolean;
    message: string;
    data:    BlogData;
}

export interface BlogResponse {
    success: boolean;
    message: string;
    data:    Blog;
}

export interface BlogData {
    data:  Blog[];
    links: Links;
    meta:  Meta;
}

export interface Blog {
    id:           string;
    title:        string;
    slug:         string;
    content:      string;
    excerpt:      string;
    status:       string;
    status_name:  string;
    published_at: Date;
    sort_order:   number;
    is_published: boolean;
    is_draft:     boolean;
    created_at:   Date;
    updated_at:   Date;
    blog_image: string
}

export interface Links {
    first: string;
    last:  string;
    prev:  null;
    next:  null;
}

export interface Meta {
    current_page: number;
    from:         number;
    last_page:    number;
    links:        Link[];
    path:         string;
    per_page:     number;
    to:           number;
    total:        number;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
