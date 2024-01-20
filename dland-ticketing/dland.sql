PGDMP     '    1    
             |            dland    15.4    15.4 +    G           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            H           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            I           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            J           1262    76416    dland    DATABASE     q   CREATE DATABASE dland WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'id_ID.UTF-8';
    DROP DATABASE dland;
                root    false            K           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'Standard public schema';
                   pg_database_owner    false    5            L           0    0    SCHEMA public    ACL     y   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   pg_database_owner    false    5            �            1255    76417 
   on_trans()    FUNCTION     l  CREATE FUNCTION public.on_trans() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ DECLARE
    cnt	INTEGER;
  BEGIN
    IF (TG_OP='INSERT') THEN
      SELECT INTO cnt (select count(idcard) from stokkartu where idcard=NEW.idcard);

      IF cnt>1 THEN
        DELETE FROM stokkartu where OID=NEW.OID;
      END IF;
    END IF;
    RETURN NULL;
  END;
$$;
 !   DROP FUNCTION public.on_trans();
       public          root    false            �            1259    85203    adonis_schema    TABLE     �   CREATE TABLE public.adonis_schema (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    batch integer NOT NULL,
    migration_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.adonis_schema;
       public         heap    root    false            �            1259    85202    adonis_schema_id_seq    SEQUENCE     �   CREATE SEQUENCE public.adonis_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.adonis_schema_id_seq;
       public          root    false    215            M           0    0    adonis_schema_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.adonis_schema_id_seq OWNED BY public.adonis_schema.id;
          public          root    false    214            �            1259    85210    adonis_schema_versions    TABLE     M   CREATE TABLE public.adonis_schema_versions (
    version integer NOT NULL
);
 *   DROP TABLE public.adonis_schema_versions;
       public         heap    root    false            �            1259    85213 
   cara_bayar    TABLE     �   CREATE TABLE public.cara_bayar (
    id integer NOT NULL,
    cara_bayar character varying(255) NOT NULL,
    deskripsi character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE public.cara_bayar;
       public         heap    root    false            �            1259    85232    master_wahana    TABLE       CREATE TABLE public.master_wahana (
    id_wahana integer NOT NULL,
    nama character varying(255) NOT NULL,
    deskripsi character varying(255),
    harga_tiket numeric(10,2) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
 !   DROP TABLE public.master_wahana;
       public         heap    root    false            �            1259    85231    master_wahana_id_wahana_seq    SEQUENCE     �   CREATE SEQUENCE public.master_wahana_id_wahana_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.master_wahana_id_wahana_seq;
       public          root    false    221            N           0    0    master_wahana_id_wahana_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.master_wahana_id_wahana_seq OWNED BY public.master_wahana.id_wahana;
          public          root    false    220            �            1259    85223    petugas    TABLE     J  CREATE TABLE public.petugas (
    id_petugas integer NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    no_hp character varying(20) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
    DROP TABLE public.petugas;
       public         heap    root    false            �            1259    85222    petugas_id_petugas_seq    SEQUENCE     �   CREATE SEQUENCE public.petugas_id_petugas_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.petugas_id_petugas_seq;
       public          root    false    219            O           0    0    petugas_id_petugas_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.petugas_id_petugas_seq OWNED BY public.petugas.id_petugas;
          public          root    false    218            �            1259    85241    transactions    TABLE     �  CREATE TABLE public.transactions (
    id_transaksi integer NOT NULL,
    no_transaksi character varying(255),
    id_wahana integer NOT NULL,
    qty integer NOT NULL,
    id_cara_bayar character varying(255) NOT NULL,
    total_bayar numeric(10,2) NOT NULL,
    petugas character varying(255) NOT NULL,
    status boolean NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
     DROP TABLE public.transactions;
       public         heap    root    false            �            1259    85240    transactions_id_transaksi_seq    SEQUENCE     �   CREATE SEQUENCE public.transactions_id_transaksi_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.transactions_id_transaksi_seq;
       public          root    false    223            P           0    0    transactions_id_transaksi_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.transactions_id_transaksi_seq OWNED BY public.transactions.id_transaksi;
          public          root    false    222            �           2604    85206    adonis_schema id    DEFAULT     t   ALTER TABLE ONLY public.adonis_schema ALTER COLUMN id SET DEFAULT nextval('public.adonis_schema_id_seq'::regclass);
 ?   ALTER TABLE public.adonis_schema ALTER COLUMN id DROP DEFAULT;
       public          root    false    215    214    215            �           2604    85235    master_wahana id_wahana    DEFAULT     �   ALTER TABLE ONLY public.master_wahana ALTER COLUMN id_wahana SET DEFAULT nextval('public.master_wahana_id_wahana_seq'::regclass);
 F   ALTER TABLE public.master_wahana ALTER COLUMN id_wahana DROP DEFAULT;
       public          root    false    221    220    221            �           2604    85226    petugas id_petugas    DEFAULT     x   ALTER TABLE ONLY public.petugas ALTER COLUMN id_petugas SET DEFAULT nextval('public.petugas_id_petugas_seq'::regclass);
 A   ALTER TABLE public.petugas ALTER COLUMN id_petugas DROP DEFAULT;
       public          root    false    219    218    219            �           2604    85244    transactions id_transaksi    DEFAULT     �   ALTER TABLE ONLY public.transactions ALTER COLUMN id_transaksi SET DEFAULT nextval('public.transactions_id_transaksi_seq'::regclass);
 H   ALTER TABLE public.transactions ALTER COLUMN id_transaksi DROP DEFAULT;
       public          root    false    223    222    223            <          0    85203    adonis_schema 
   TABLE DATA           H   COPY public.adonis_schema (id, name, batch, migration_time) FROM stdin;
    public          root    false    215   :3       =          0    85210    adonis_schema_versions 
   TABLE DATA           9   COPY public.adonis_schema_versions (version) FROM stdin;
    public          root    false    216   �3       >          0    85213 
   cara_bayar 
   TABLE DATA           W   COPY public.cara_bayar (id, cara_bayar, deskripsi, created_at, updated_at) FROM stdin;
    public          root    false    217   4       B          0    85232    master_wahana 
   TABLE DATA           h   COPY public.master_wahana (id_wahana, nama, deskripsi, harga_tiket, created_at, updated_at) FROM stdin;
    public          root    false    221   4       @          0    85223    petugas 
   TABLE DATA           n   COPY public.petugas (id_petugas, nama_lengkap, no_hp, username, password, created_at, updated_at) FROM stdin;
    public          root    false    219   B6       D          0    85241    transactions 
   TABLE DATA           �   COPY public.transactions (id_transaksi, no_transaksi, id_wahana, qty, id_cara_bayar, total_bayar, petugas, status, created_at, updated_at) FROM stdin;
    public          root    false    223   �6       Q           0    0    adonis_schema_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.adonis_schema_id_seq', 4, true);
          public          root    false    214            R           0    0    master_wahana_id_wahana_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.master_wahana_id_wahana_seq', 1, false);
          public          root    false    220            S           0    0    petugas_id_petugas_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.petugas_id_petugas_seq', 1, false);
          public          root    false    218            T           0    0    transactions_id_transaksi_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.transactions_id_transaksi_seq', 5, true);
          public          root    false    222            �           2606    85209     adonis_schema adonis_schema_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.adonis_schema
    ADD CONSTRAINT adonis_schema_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.adonis_schema DROP CONSTRAINT adonis_schema_pkey;
       public            root    false    215            �           2606    85221    cara_bayar cara_bayar_id_unique 
   CONSTRAINT     X   ALTER TABLE ONLY public.cara_bayar
    ADD CONSTRAINT cara_bayar_id_unique UNIQUE (id);
 I   ALTER TABLE ONLY public.cara_bayar DROP CONSTRAINT cara_bayar_id_unique;
       public            root    false    217            �           2606    85219    cara_bayar cara_bayar_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.cara_bayar
    ADD CONSTRAINT cara_bayar_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.cara_bayar DROP CONSTRAINT cara_bayar_pkey;
       public            root    false    217            �           2606    85239     master_wahana master_wahana_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.master_wahana
    ADD CONSTRAINT master_wahana_pkey PRIMARY KEY (id_wahana);
 J   ALTER TABLE ONLY public.master_wahana DROP CONSTRAINT master_wahana_pkey;
       public            root    false    221            �           2606    85228    petugas petugas_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.petugas
    ADD CONSTRAINT petugas_pkey PRIMARY KEY (id_petugas);
 >   ALTER TABLE ONLY public.petugas DROP CONSTRAINT petugas_pkey;
       public            root    false    219            �           2606    85230    petugas petugas_username_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.petugas
    ADD CONSTRAINT petugas_username_unique UNIQUE (username);
 I   ALTER TABLE ONLY public.petugas DROP CONSTRAINT petugas_username_unique;
       public            root    false    219            �           2606    85248    transactions transactions_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id_transaksi);
 H   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
       public            root    false    223            �           2606    85249 +   transactions transactions_id_wahana_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_id_wahana_foreign FOREIGN KEY (id_wahana) REFERENCES public.master_wahana(id_wahana);
 U   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_id_wahana_foreign;
       public          root    false    3241    221    223            <   �   x���A�0@�5�½f�S��,&͠�M[c���r%a���h�^��ܧ1j�sjP�Zv�$F�Y��^?ï)�  � +���@g�0������e@6�sȯQ������dI�¾����P�<���[*��C�:'��i�e^�S]���
d<      =      x�3����� a �      >      x������ � �      B     x���͎�@���S�=all�޲������u�\riLf��O"�>�`��-M��jo�3㩄�>8R���j4>@I�B�+����J���\(�7#&j��'IS���.N7q�Bz|̳��C���?���Q�SO���'�N=�ud�T��s����n������e �-z�t�������i�ꅬ�}��S�S(���BӢ��"��_��2��!8�d�*��̗Q�W?y�V��.�sV��v&wdFچ9���tª����Ҍ�Y�!���C/1ǋK�o�0f��pn��*�&Q�:7[�(:����R�A�p�
|�Z�}�J�0S�CSiϱ�5�n�.��A�h��Emԉ,y�N^nܖ��V���<v�~���3_��>_��(ڤ�2�UV�=��PW`#�~4\>ޒ;h�~ ]i@�w��u�J�S蛍⋓�o�Y�.���7d��x����	>9�Y`�����'���W��� ��`��e���K*n���q�a-7�Z�哛.�WE�?�MZ!      @   9   x�3�tL����,.)J,�/�4�L񡤑������������i������� ��      D   �   x���1
�0�Y:E��K�j�'�!��,��%��k
)�.!�h���)4x�Wx��$4�Df�w ���6��Um �℔M��wgč��&.+�!�/B�X2:�b�A|Djb�����D�&pqu���fc�     