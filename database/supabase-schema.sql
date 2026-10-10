-- Execute este SQL no Supabase SQL Editor.
-- Antes de executar, crie no Supabase Auth um usuário com:
-- e-mail: admin@casadosesportes.com.br
-- senha: defina uma senha forte no painel do Supabase.
-- A senha nunca deve ser inserida neste arquivo ou diretamente em auth.users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'customer';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('customer', 'admin'));

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;

create policy "Usuário pode ver o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Administrador pode ver perfis"
  on public.profiles for select
  using (public.is_admin());

create policy "Usuário pode criar o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id and role = 'customer');

create policy "Usuário pode atualizar o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = 'customer');

create policy "Administrador pode atualizar perfis"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  promotional_price numeric(10,2) check (promotional_price is null or promotional_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Visitantes podem ver produtos ativos"
  on public.products for select
  using (active = true or public.is_admin());

create policy "Somente administradores podem adicionar produtos"
  on public.products for insert
  with check (public.is_admin());

create policy "Somente administradores podem editar produtos"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Somente administradores podem excluir produtos"
  on public.products for delete
  using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone, role)
  values (
    new.id,
    case when lower(new.email) = 'admin@casadosesportes.com.br' then 'Administrador' else coalesce(new.raw_user_meta_data->>'name', 'Atleta') end,
    new.raw_user_meta_data->>'phone',
    case when lower(new.email) = 'admin@casadosesportes.com.br' then 'admin' else 'customer' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Se o usuário administrador já existir no Auth, este comando concede a função.
update public.profiles
set role = 'admin', name = 'Administrador'
where id = (select id from auth.users where lower(email) = 'augustonewtonm@gmail.com');

select id, name, role
from public.profiles
where role = 'admin';