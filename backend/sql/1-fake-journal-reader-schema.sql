CREATE DATABASE fake_journal_reader;
\c fake_journal_reader

-- Table Structure
-- Primary Key
-- Creation Time
-- Creator User Id (if applicable)
-- Everything else

drop table if exists article cascade;
create table goal(
  article_id bigserial primary key,
  creation_time bigint not null,
  creator_user_id bigint not null
);

-- invariant: article_id is valid
drop table if exists article_data cascade;
create table article_data(
  article_data_id bigserial primary key,
  creation_time bigint not null,
  creator_user_id bigint not null,
  article_id bigint not null references article(article_id),
  -- article title
  title text not null,
  -- how long is the article expected to read
  duration_estimate text not null,
  -- is the article still visible
  active bool not null
);

create view recent_article_data as
  select ad.* from article_data ad
  inner join (
   select max(article_data_id) id 
   from article_data 
   group by article_id
  ) maxids
  on maxids.id = ad.article_data_id;


-- article section data
drop table if exists article_section cascade;
create table article_section(
  article_section_id bigserial primary key,
  creation_time bigint not null,
  creator_user_id bigint not null,
  article_id bigint not null references article(article_id),
  position bigint not null,
  correct bool not null,
  section_text text not null,
  active bool not null
);

create view recent_article_section as
  select a_s.* from article_section a_s
  inner join (
   select max(article_section_id) id 
   from article_section 
   group by article_id
  ) maxids
  on maxids.id = a_s.article_section_id;
