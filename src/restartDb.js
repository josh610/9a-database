const { Client } = require('pg')

const query = `
DROP TABLE IF EXISTS country CASCADE;
CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name character varying(255) DEFAULT 'NOT NULL'::character varying UNIQUE,
    iso_code character varying(3) DEFAULT 'NOT NULL'::character varying UNIQUE,
    description text
);
CREATE UNIQUE INDEX name_unique ON country(name text_ops);
CREATE UNIQUE INDEX iso_code_unique ON country(iso_code text_ops);

DROP TABLE IF EXISTS crag CASCADE;
CREATE TABLE crag (
    id SERIAL PRIMARY KEY,
    name character varying(255) DEFAULT 'NOT NULL'::character varying UNIQUE,
    country_id integer REFERENCES country(id),
    description text,
    added_at date DEFAULT CURRENT_DATE
);

DROP TABLE IF EXISTS climber CASCADE;
CREATE TABLE climber (
    id SERIAL PRIMARY KEY,
    name character varying(255) DEFAULT 'NOT NULL'::character varying UNIQUE,
    nickname character varying(255),
    country_id integer REFERENCES country(id),
    dob date,
    sex character varying(10),
    description text,
    added_at date DEFAULT CURRENT_DATE
);

DROP TABLE IF EXISTS climb CASCADE;
CREATE TABLE climb (
    id SERIAL PRIMARY KEY,
    name character varying(255) DEFAULT 'NOT NULL'::character varying UNIQUE,
    grade character varying(10),
    crag_id integer REFERENCES crag(id) ON DELETE SET NULL,
    description text,
    added_at date DEFAULT CURRENT_DATE
);

DROP TABLE IF EXISTS ascent CASCADE;
CREATE TABLE ascent (
    id SERIAL PRIMARY KEY,
    climber_id integer NOT NULL REFERENCES climber(id),
    climb_id integer NOT NULL REFERENCES climb(id),
    grade_proposal character varying(10),
    fa boolean,
    flash boolean,
    onsight boolean,
    _date date,
    links text[],
    description text,
    added_at date DEFAULT CURRENT_DATE
);
CREATE UNIQUE INDEX climber_climb_unique ON ascent(climber_id int4_ops,climb_id int4_ops);
`

const client = new Client({
    database: '_9a_backup',
    port: 5432,
})
client.connect().then(() => {
    return client.query(query)
    })
    .then((res) => {
        console.log(res)
        client.end()
    })