-- Datos ficticios para desarrollo y pruebas locales.
-- Se asume que el esquema ya fue creado en el esquema public.
-- Los IDs fijos y los UPSERT permiten volver a ejecutar este archivo
-- sin duplicar los registros de prueba.

BEGIN;

INSERT INTO public.planes (id_plan, dias, precio)
VALUES
    (9001, '2', 15000),
    (9002, '3', 22000),
    (9003, '5', 30000)
ON CONFLICT (id_plan) DO UPDATE SET
    dias = EXCLUDED.dias,
    precio = EXCLUDED.precio;

INSERT INTO public.socios (
    id_socios,
    id_plan,
    dni,
    nombre,
    apellido,
    telefono,
    redes,
    email,
    fecha_alta,
    activo,
    fecha_nacimiento
)
VALUES
    (9101, 9001, 99000101, 'Lucia', 'Pereyra', '11-4000-0101', '@lucia.pereyra', 'lucia.pereyra@example.test', CURRENT_DATE - 120, TRUE,  DATE '1998-04-12'),
    (9102, 9002, 99000102, 'Mateo', 'Duarte',  '11-4000-0102', '@mateo.duarte',  'mateo.duarte@example.test',  CURRENT_DATE - 240, TRUE,  DATE '1994-09-23'),
    (9103, 9003, 99000103, 'Camila', 'Rios',    '11-4000-0103', '@camila.rios',   'camila.rios@example.test',   CURRENT_DATE - 300, FALSE, DATE '2000-02-07'),
    (9104, 9002, 99000104, 'Nicolas', 'Vega',   '11-4000-0104', '@nicolas.vega',  'nicolas.vega@example.test',  CURRENT_DATE - 45,  TRUE,  DATE '1991-11-18'),
    (9105, 9002, 99000105, 'Valentina', 'Soler','11-4000-0105', '@vale.soler',    'valentina.soler@example.test', CURRENT_DATE - 180, TRUE, DATE '1997-06-30'),
    (9106, 9001, 99000106, 'Bruno', 'Acosta',   '11-4000-0106', '@bruno.acosta',  'bruno.acosta@example.test',  CURRENT_DATE - 210, TRUE,  DATE '1989-01-25')
ON CONFLICT (id_socios) DO UPDATE SET
    id_plan = EXCLUDED.id_plan,
    dni = EXCLUDED.dni,
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    telefono = EXCLUDED.telefono,
    redes = EXCLUDED.redes,
    email = EXCLUDED.email,
    fecha_alta = EXCLUDED.fecha_alta,
    activo = EXCLUDED.activo,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento;

INSERT INTO public.cuotas (
    id_cuota,
    id_socios,
    fecha_emision,
    fecha_ult_rec,
    vencimiento,
    monto,
    estado,
    periodo
)
OVERRIDING SYSTEM VALUE
VALUES
    (9201, 9101, CURRENT_DATE - 65, CURRENT_DATE - 20, CURRENT_DATE - 35, 15000, 'Pagada',   to_char((CURRENT_DATE - 65)::timestamp, 'YYYY-MM')),
    (9202, 9101, CURRENT_DATE - 26, NULL,              CURRENT_DATE + 4,  15000, 'Pendiente', to_char((CURRENT_DATE - 26)::timestamp, 'YYYY-MM')),
    (9203, 9102, CURRENT_DATE - 38, NULL,              CURRENT_DATE - 8,  22000, 'Vencida',  to_char((CURRENT_DATE - 38)::timestamp, 'YYYY-MM')),
    (9204, 9103, CURRENT_DATE - 95, CURRENT_DATE - 60, CURRENT_DATE - 65, 30000, 'Pagada',   to_char((CURRENT_DATE - 95)::timestamp, 'YYYY-MM')),
    (9205, 9105, CURRENT_DATE - 16, NULL,              CURRENT_DATE + 14, 22000, 'Pendiente', to_char((CURRENT_DATE - 16)::timestamp, 'YYYY-MM')),
    (9206, 9106, CURRENT_DATE - 120, CURRENT_DATE - 88, CURRENT_DATE - 90, 15000, 'Pagada',  to_char((CURRENT_DATE - 120)::timestamp, 'YYYY-MM')),
    (9207, 9106, CURRENT_DATE - 28, NULL,              CURRENT_DATE + 2,  15000, 'Pendiente', to_char((CURRENT_DATE - 28)::timestamp, 'YYYY-MM'))
ON CONFLICT (id_cuota) DO UPDATE SET
    id_socios = EXCLUDED.id_socios,
    fecha_emision = EXCLUDED.fecha_emision,
    fecha_ult_rec = EXCLUDED.fecha_ult_rec,
    vencimiento = EXCLUDED.vencimiento,
    monto = EXCLUDED.monto,
    estado = EXCLUDED.estado,
    periodo = EXCLUDED.periodo;

INSERT INTO public.pagos (
    id_pago,
    id_socios,
    monto_total,
    fecha_pago,
    metodo_pago
)
OVERRIDING SYSTEM VALUE
VALUES
    (9301, 9101, 15000, CURRENT_DATE - 20, 'Efectivo'),
    (9302, 9103, 30000, CURRENT_DATE - 60, 'Transferencia'),
    (9303, 9106, 15000, CURRENT_DATE - 88, 'Tarjeta')
ON CONFLICT (id_pago) DO UPDATE SET
    id_socios = EXCLUDED.id_socios,
    monto_total = EXCLUDED.monto_total,
    fecha_pago = EXCLUDED.fecha_pago,
    metodo_pago = EXCLUDED.metodo_pago;

INSERT INTO public.detalle_pago (
    id_detalle,
    id_pago,
    id_cuota,
    monto_aplicado
)
OVERRIDING SYSTEM VALUE
VALUES
    (9401, 9301, 9201, 15000),
    (9402, 9302, 9204, 30000),
    (9403, 9303, 9206, 15000)
ON CONFLICT (id_detalle) DO UPDATE SET
    id_pago = EXCLUDED.id_pago,
    id_cuota = EXCLUDED.id_cuota,
    monto_aplicado = EXCLUDED.monto_aplicado;

-- Avanza las secuencias para que nuevas filas no reutilicen los IDs del seed.
SELECT setval(pg_get_serial_sequence('public.planes', 'id_plan'), (SELECT MAX(id_plan) FROM public.planes), TRUE);
SELECT setval(pg_get_serial_sequence('public.socios', 'id_socios'), (SELECT MAX(id_socios) FROM public.socios), TRUE);
SELECT setval(pg_get_serial_sequence('public.cuotas', 'id_cuota'), (SELECT MAX(id_cuota) FROM public.cuotas), TRUE);
SELECT setval(pg_get_serial_sequence('public.pagos', 'id_pago'), (SELECT MAX(id_pago) FROM public.pagos), TRUE);
SELECT setval(pg_get_serial_sequence('public.detalle_pago', 'id_detalle'), (SELECT MAX(id_detalle) FROM public.detalle_pago), TRUE);

COMMIT;
