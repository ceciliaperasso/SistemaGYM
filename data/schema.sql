--
-- PostgreSQL database dump
--

\restrict 3aS6Xi1dqH96OxdpMqTzfVS7ENAida3iCX9yI5evelize8gijYys76Z9u8zodDy

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4
-- Crear la base de datos

-- Started on 2026-10-12 19:06:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 24768)
-- Name: cuotas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuotas (
    id_cuota integer NOT NULL,
    id_socios integer NOT NULL,
    fecha_emision date DEFAULT CURRENT_DATE NOT NULL,
    fecha_ult_rec date,
    vencimiento date NOT NULL,
    monto numeric(10,2) NOT NULL,
    estado character varying(20) DEFAULT 'Pendiente'::character varying NOT NULL,
    periodo character varying(30),
    CONSTRAINT chk_cuotas_monto CHECK ((monto > (0)::numeric)),
    CONSTRAINT chk_estado_cuota CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'Pago Parcial'::character varying, 'Vencida'::character varying, 'Pagada'::character varying])::text[])))
);


ALTER TABLE public.cuotas OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24767)
-- Name: cuotas_id_cuota_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cuotas ALTER COLUMN id_cuota ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cuotas_id_cuota_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 24804)
-- Name: detalle_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pago (
    id_detalle integer NOT NULL,
    id_pago integer NOT NULL,
    id_cuota integer NOT NULL,
    monto_aplicado numeric(10,2) NOT NULL,
    CONSTRAINT chk_detalle_monto CHECK ((monto_aplicado > (0)::numeric))
);


ALTER TABLE public.detalle_pago OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24803)
-- Name: detalle_pago_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.detalle_pago ALTER COLUMN id_detalle ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.detalle_pago_id_detalle_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 24786)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id_pago integer NOT NULL,
    id_socios integer NOT NULL,
    monto_total numeric(10,2) NOT NULL,
    fecha_pago date DEFAULT CURRENT_DATE NOT NULL,
    metodo_pago character varying(30) NOT NULL,
    CONSTRAINT chk_pagos_monto CHECK ((monto_total > (0)::numeric))
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24785)
-- Name: pagos_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.pagos ALTER COLUMN id_pago ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pagos_id_pago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 24715)
-- Name: planes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planes (
    id_plan integer CONSTRAINT planes_id_planes_not_null NOT NULL,
    dias character varying(10) NOT NULL,
    precio integer NOT NULL
);


ALTER TABLE public.planes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24714)
-- Name: planes_id_planes_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.planes_id_planes_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planes_id_planes_seq OWNER TO postgres;

--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 219
-- Name: planes_id_planes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.planes_id_planes_seq OWNED BY public.planes.id_plan;


--
-- TOC entry 222 (class 1259 OID 24723)
-- Name: socios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.socios (
    id_socios integer NOT NULL,
    id_plan integer,
    dni integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    telefono character varying(20),
    redes character varying(50),
    email character varying(50),
    fecha_alta date,
    activo boolean,
    fecha_nacimiento date
);


ALTER TABLE public.socios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24722)
-- Name: socios_id_socios_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.socios_id_socios_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.socios_id_socios_seq OWNER TO postgres;

--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 221
-- Name: socios_id_socios_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.socios_id_socios_seq OWNED BY public.socios.id_socios;


--
-- TOC entry 4775 (class 2604 OID 24718)
-- Name: planes id_plan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planes ALTER COLUMN id_plan SET DEFAULT nextval('public.planes_id_planes_seq'::regclass);


--
-- TOC entry 4776 (class 2604 OID 24726)
-- Name: socios id_socios; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socios ALTER COLUMN id_socios SET DEFAULT nextval('public.socios_id_socios_seq'::regclass);


--
-- TOC entry 4789 (class 2606 OID 24779)
-- Name: cuotas cuotas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuotas
    ADD CONSTRAINT cuotas_pkey PRIMARY KEY (id_cuota);


--
-- TOC entry 4793 (class 2606 OID 24813)
-- Name: detalle_pago detalle_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pago
    ADD CONSTRAINT detalle_pago_pkey PRIMARY KEY (id_detalle);


--
-- TOC entry 4791 (class 2606 OID 24797)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4785 (class 2606 OID 24721)
-- Name: planes planes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planes
    ADD CONSTRAINT planes_pkey PRIMARY KEY (id_plan);


--
-- TOC entry 4787 (class 2606 OID 24729)
-- Name: socios socios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socios
    ADD CONSTRAINT socios_pkey PRIMARY KEY (id_socios);


--
-- TOC entry 4795 (class 2606 OID 24815)
-- Name: detalle_pago uq_pago_cuota; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pago
    ADD CONSTRAINT uq_pago_cuota UNIQUE (id_pago, id_cuota);


--
-- TOC entry 4797 (class 2606 OID 24780)
-- Name: cuotas fk_cuotas_socios; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuotas
    ADD CONSTRAINT fk_cuotas_socios FOREIGN KEY (id_socios) REFERENCES public.socios(id_socios) ON DELETE RESTRICT;


--
-- TOC entry 4799 (class 2606 OID 24821)
-- Name: detalle_pago fk_detalle_pago_cuotas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pago
    ADD CONSTRAINT fk_detalle_pago_cuotas FOREIGN KEY (id_cuota) REFERENCES public.cuotas(id_cuota) ON DELETE RESTRICT;


--
-- TOC entry 4800 (class 2606 OID 24816)
-- Name: detalle_pago fk_detalle_pago_pagos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pago
    ADD CONSTRAINT fk_detalle_pago_pagos FOREIGN KEY (id_pago) REFERENCES public.pagos(id_pago) ON DELETE RESTRICT;


--
-- TOC entry 4798 (class 2606 OID 24798)
-- Name: pagos fk_pagos_socios; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT fk_pagos_socios FOREIGN KEY (id_socios) REFERENCES public.socios(id_socios) ON DELETE RESTRICT;


--
-- TOC entry 4796 (class 2606 OID 24730)
-- Name: socios socios_id_plan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.socios
    ADD CONSTRAINT socios_id_plan_fkey FOREIGN KEY (id_plan) REFERENCES public.planes(id_plan);


-- Completed on 2026-10-12 19:06:39

--
-- PostgreSQL database dump complete
--

\unrestrict 3aS6Xi1dqH96OxdpMqTzfVS7ENAida3iCX9yI5evelize8gijYys76Z9u8zodDy

