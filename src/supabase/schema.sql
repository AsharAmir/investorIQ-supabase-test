-- Create tables for Supabase
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.advisor_requests enable row level security;
-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade,
    name text,
    email text,
    avatar_url text,
    role text default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);
-- Create properties table
create table public.properties (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    address text not null,
    price numeric not null,
    deal_type text not null,
    description text,
    images text [] default '{}',
    iq_score integer default 0,
    user_id uuid references public.profiles(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Create advisor_requests table
create table public.advisor_requests (
    id uuid default uuid_generate_v4() primary key,
    property_id uuid references public.properties(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete cascade,
    advisor_id uuid references public.profiles(id),
    message text not null,
    response text,
    status text default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    responded_at timestamp with time zone
);
-- RLS Policies
-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles for
select using (true);
create policy "Users can insert their own profile" on public.profiles for
insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
-- Properties policies
create policy "Properties are viewable by everyone" on public.properties for
select using (true);
create policy "Authenticated users can create properties" on public.properties for
insert with check (auth.role() = 'authenticated');
create policy "Users can update own properties" on public.properties for
update using (auth.uid() = user_id);
create policy "Users can delete own properties" on public.properties for delete using (auth.uid() = user_id);
-- Advisor requests policies
create policy "Users can view their own requests" on public.advisor_requests for
select using (
        auth.uid() = user_id
        or exists (
            select 1
            from public.profiles
            where id = auth.uid()
                and role = 'admin'
        )
    );
create policy "Authenticated users can create requests" on public.advisor_requests for
insert with check (auth.role() = 'authenticated');
create policy "Only admins can update requests" on public.advisor_requests for
update using (
        exists (
            select 1
            from public.profiles
            where id = auth.uid()
                and role = 'admin'
        )
    );