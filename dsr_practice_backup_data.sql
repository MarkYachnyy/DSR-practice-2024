--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2024-07-15 12:09:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3357 (class 0 OID 16688)
-- Dependencies: 219
-- Data for Name: debts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.debts (spending_id, user_id, amount) FROM stdin;
4	12	500
4	10	300
4	9	200
4	8	100
19	8	375
19	9	375
19	12	375
19	10	0
20	10	625
20	12	625
20	8	0
20	9	625
\.


--
-- TOC entry 3356 (class 0 OID 16610)
-- Dependencies: 218
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.friends (receiver_id, sender_id, date, status) FROM stdin;
10	8	2024-07-11	ACCEPTED
10	9	2024-07-11	ACCEPTED
9	8	2024-07-11	ACCEPTED
12	8	2024-07-11	ACCEPTED
\.



--
-- TOC entry 3359 (class 0 OID 16694)
-- Dependencies: 221
-- Data for Name: spendings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spendings (id, creator_id, date, name, payer_id) FROM stdin;
4	8	2024-07-12	Поход Марков	8
19	8	2024-07-14	Поход Марков Сиквел	10
20	8	2024-07-14	Поход Марков Я Платил	8
\.


--
-- TOC entry 3354 (class 0 OID 16568)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, password) FROM stdin;
8	mark2	$2a$10$A0xRrBQuDe4DJhzgeJUKseYg7vSLP1wwvdz4kAuxESW0TLlwePXeW
9	mark3	$2a$10$0jXYTQH/PMB/Ep2MBLYBG.9hHwz6VuM.My3Cp9PbAmC7o1HH2j5Ui
10	mark4	$2a$10$f2Zso70jjDeW6Eac2PDjMeAmaRNTF2OJmhBKFkR74qUPPMxqA5asC
12	mark5	$2a$10$r07/AhZ3AwAgwgpgzYnT3./cooHXfUbBx6pEmQ/We8FXwEgUxi2Zu
\.


--
-- TOC entry 3355 (class 0 OID 16575)
-- Dependencies: 217
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_roles (user_id, roles_id) FROM stdin;
8	1
9	1
10	1
12	1
\.


--
-- TOC entry 3365 (class 0 OID 0)
-- Dependencies: 220
-- Name: spendings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spendings_id_seq', 20, true);


--
-- TOC entry 3366 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


-- Completed on 2024-07-15 12:09:48

--
-- PostgreSQL database dump complete
--

