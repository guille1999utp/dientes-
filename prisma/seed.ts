import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  }),
});

const services = [
  {
    slug: "primera-visita",
    name: "Mi Primera Visita",
    emoji: "🍼",
    color: "sky",
    shortDescription: "Valoración amorosa para bebés y peques desde su primer dientito.",
    description:
      "La primera cita es una experiencia de juego y confianza. Revisamos la boca del bebé, explicamos a los papás cómo cuidar las encías y los primeros dientes, y resolvemos dudas sobre chupos, teteros y lactancia. Recomendamos la primera visita al salir el primer diente o antes del primer año.",
    benefits:
      "Detección temprana de problemas|Guía de cepillado para papás|Consejos de alimentación|Ambiente sin miedo",
    ageRange: "0 a 3 años",
    durationMin: 30,
    priceFrom: 60000,
    order: 1,
  },
  {
    slug: "limpieza-profilaxis",
    name: "Limpieza Burbujeante",
    emoji: "🪥",
    color: "mint",
    shortDescription: "Profilaxis divertida que deja los dientes brillantes y sanos.",
    description:
      "Retiramos la placa bacteriana y las manchas con pastas de sabores que los niños eligen. Durante la limpieza enseñamos la técnica de cepillado con nuestro amigo Dientín y entregamos un diploma de valentía al finalizar.",
    benefits: "Pasta de sabores a elección|Enseñanza de cepillado|Diploma de valentía|Revisión completa",
    ageRange: "2 a 14 años",
    durationMin: 40,
    priceFrom: 80000,
    order: 2,
  },
  {
    slug: "fluor-sellantes",
    name: "Escudo Protector",
    emoji: "🛡️",
    color: "sun",
    shortDescription: "Flúor y sellantes que crean un escudo contra las caries.",
    description:
      "Aplicamos barniz de flúor y sellantes de fosetas y fisuras en las muelas, las zonas donde más se esconden las bacterias. Es un procedimiento rápido, indoloro y una de las mejores formas de prevenir caries en la infancia.",
    benefits: "Indoloro y rápido|Reduce caries hasta 80%|Protección por años|Ideal para molares nuevos",
    ageRange: "3 a 14 años",
    durationMin: 30,
    priceFrom: 90000,
    order: 3,
  },
  {
    slug: "tratamiento-caries",
    name: "Cazadores de Caries",
    emoji: "🦷",
    color: "coral",
    shortDescription: "Tratamos las caries con técnicas suaves y materiales del color del diente.",
    description:
      "Usamos anestesia tópica de sabores, técnicas de mínima intervención y resinas estéticas. Explicamos cada paso con el método 'decir-mostrar-hacer' para que el niño se sienta seguro y en control.",
    benefits: "Anestesia tópica de sabores|Resinas del color del diente|Mínima intervención|Método decir-mostrar-hacer",
    ageRange: "2 a 14 años",
    durationMin: 45,
    priceFrom: 120000,
    order: 4,
  },
  {
    slug: "ortodoncia-preventiva",
    name: "Ortodoncia Preventiva",
    emoji: "😁",
    color: "grape",
    shortDescription: "Guiamos el crecimiento de los maxilares para una sonrisa alineada.",
    description:
      "Detectamos a tiempo mordidas cruzadas, apiñamiento y hábitos como chuparse el dedo. Con aparatos removibles y de colores corregimos el crecimiento y evitamos tratamientos más largos en la adolescencia.",
    benefits: "Aparatos de colores|Corrige hábitos|Evita extracciones futuras|Seguimiento del crecimiento",
    ageRange: "5 a 12 años",
    durationMin: 45,
    priceFrom: 150000,
    order: 5,
  },
  {
    slug: "necesidades-especiales",
    name: "Sonrisas Especiales",
    emoji: "💙",
    color: "sky",
    shortDescription: "Atención adaptada para niños con necesidades especiales.",
    description:
      "Contamos con protocolos sensoriales, citas más largas y un equipo entrenado para acompañar a niños con autismo, TDAH, síndrome de Down y otras condiciones. Adaptamos luces, sonidos y tiempos a cada peque.",
    benefits: "Consultorio sensorial|Citas sin afán|Equipo entrenado|Trabajo con la familia",
    ageRange: "Todas las edades",
    durationMin: 60,
    priceFrom: 110000,
    order: 6,
  },
  {
    slug: "urgencias",
    name: "Urgencias Dentales",
    emoji: "🚑",
    color: "coral",
    shortDescription: "Golpes, dolor o dientes partidos: te atendemos el mismo día.",
    description:
      "Los accidentes pasan jugando. Si tu peque se golpeó un diente, tiene dolor o inflamación, te atendemos con prioridad. Si un diente permanente se cae, guárdalo en leche y llámanos de inmediato.",
    benefits: "Atención el mismo día|Manejo del dolor|Reimplante dental|Línea de WhatsApp",
    ageRange: "Todas las edades",
    durationMin: 30,
    priceFrom: 100000,
    order: 7,
  },
  {
    slug: "escuela-cepillado",
    name: "Escuela de Cepillado",
    emoji: "📚",
    color: "mint",
    shortDescription: "Talleres de higiene oral con juegos, canciones y premios.",
    description:
      "Un taller práctico para niños y papás donde aprendemos a cepillarnos, usar seda dental y elegir snacks amigos de los dientes. Ideal para colegios, jardines y grupos de amigos.",
    benefits: "Juegos y canciones|Kit de cepillado de regalo|Para grupos y colegios|Papás incluidos",
    ageRange: "3 a 10 años",
    durationMin: 60,
    priceFrom: 50000,
    order: 8,
  },
];

const posts = [
  {
    slug: "cuando-llevar-a-mi-hijo-al-odontologo",
    title: "¿Cuándo llevar a mi hijo al odontólogo por primera vez?",
    excerpt: "La respuesta te puede sorprender: mucho antes de lo que imaginas. Te contamos por qué la primera visita temprana marca la diferencia.",
    category: "Bebés",
    emoji: "🍼",
    color: "sky",
    readMinutes: 4,
    content: `La Academia Americana de Odontopediatría recomienda que la **primera visita** ocurra cuando sale el primer diente o, a más tardar, al cumplir el primer año.

## ¿Por qué tan temprano?

Las caries de la primera infancia pueden aparecer apenas brotan los dientes. Una visita temprana nos permite:

- Revisar que las encías y los dientes estén sanos
- Enseñar a los papás a limpiar la boca del bebé
- Hablar sobre teteros nocturnos, chupos y lactancia
- Crear una relación positiva con el odontólogo

## ¿Qué pasa en la cita?

Es una consulta corta y tranquila. El bebé se sienta en las piernas de mamá o papá (rodilla a rodilla con el odontólogo) y revisamos su boquita mientras jugamos. **No hay agujas ni ruidos fuertes.**

## Consejo de Dientín

Empieza a limpiar las encías del bebé con una gasa húmeda desde los primeros meses. ¡Así se acostumbra a la sensación del cepillado!`,
  },
  {
    slug: "tecnica-de-cepillado-para-ninos",
    title: "La técnica de cepillado perfecta según la edad",
    excerpt: "Cuánta crema usar, cuánto tiempo cepillar y cuándo dejar que lo hagan solos. Una guía práctica para cada etapa.",
    category: "Prevención",
    emoji: "🪥",
    color: "mint",
    readMinutes: 5,
    content: `Cepillarse bien es el superpoder número uno contra las caries. Pero la técnica cambia con la edad.

## De 0 a 3 años

- Usa un cepillo de cabeza pequeña y cerdas suaves
- Crema dental con flúor del tamaño de **un granito de arroz**
- Los papás hacen todo el cepillado

## De 3 a 6 años

- Crema dental del tamaño de **una arveja**
- El niño puede intentarlo, pero un adulto siempre repasa
- Enseña a escupir sin enjuagar con mucha agua

## De 6 años en adelante

- Ya pueden cepillarse solos, con supervisión hasta los 8 o 9 años
- Introduce la **seda dental** cuando los dientes se toquen entre sí

## La regla de oro: 2 x 2

Dos veces al día, durante dos minutos. Prueba nuestro **temporizador de cepillado** en el Rincón Infantil para que sea un juego.`,
  },
  {
    slug: "snacks-amigos-de-los-dientes",
    title: "10 snacks amigos de los dientes para la lonchera",
    excerpt: "No todo lo saludable es amigable con los dientes. Descubre qué empacar en la lonchera para cuidar su sonrisa.",
    category: "Alimentación",
    emoji: "🍎",
    color: "sun",
    readMinutes: 3,
    content: `Lo que comen los niños entre comidas influye muchísimo en la salud de sus dientes.

## Los favoritos de Dientín

- Queso en cubitos: ayuda a neutralizar los ácidos
- Zanahoria y pepino en palitos: limpian mientras se mastican
- Manzana y pera en tajadas
- Yogur natural sin azúcar
- Huevo cocido
- Maní y nueces (en niños mayores de 5 años)
- Arepa con queso
- Agua, siempre agua

## Los que conviene evitar

Las galletas dulces, los jugos de caja y las frutas deshidratadas se pegan a los dientes y alimentan a las bacterias. **No es prohibirlos, es reservarlos para ocasiones especiales** y cepillarse después.`,
  },
  {
    slug: "miedo-al-odontologo",
    title: "Cómo ayudar a tu hijo a perderle el miedo al odontólogo",
    excerpt: "Las palabras que usamos en casa importan. Estrategias sencillas para que la visita sea una aventura y no un susto.",
    category: "Emociones",
    emoji: "🦸",
    color: "grape",
    readMinutes: 4,
    content: `El miedo al odontólogo suele aprenderse. La buena noticia es que también se puede prevenir.

## Antes de la cita

- Lee cuentos o mira videos sobre visitas al odontólogo
- Juega al dentista con sus muñecos
- Evita palabras como **"no te va a doler"**, "aguja" o "chuzón"

## El día de la cita

- Llega con tiempo para que explore la sala de juegos
- Mantén la calma: los niños leen nuestras emociones
- Deja que nuestro equipo guíe la conversación

## Después de la cita

Celebra su valentía. En Sonrisitas cada niño recibe su **diploma de valentía** y elige un premio del cofre del tesoro.`,
  },
  {
    slug: "chupo-y-dedo",
    title: "Chupo y dedo: ¿cuándo se convierten en un problema?",
    excerpt: "Succionar es normal en los bebés, pero mantener el hábito puede afectar la mordida. Te explicamos cuándo actuar.",
    category: "Hábitos",
    emoji: "👍",
    color: "coral",
    readMinutes: 4,
    content: `Chuparse el dedo o usar chupo es un reflejo natural que calma a los bebés. El problema aparece cuando el hábito se prolonga.

## ¿Hasta cuándo es normal?

Lo ideal es retirar el chupo entre los **2 y 3 años**. Después de esa edad, la succión constante puede causar:

- Mordida abierta (los dientes de adelante no se tocan)
- Paladar estrecho
- Dientes superiores hacia adelante

## Ideas para dejar el hábito

- Calendario de estrellas con premios
- El "hada del chupo" que lo cambia por un juguete
- Identificar los momentos en que lo necesita (sueño, aburrimiento)

Si el hábito persiste después de los 4 años, nuestra **ortodoncia preventiva** puede ayudar.`,
  },
  {
    slug: "golpes-en-los-dientes",
    title: "¿Qué hacer si tu hijo se golpea un diente?",
    excerpt: "Una guía rápida de primeros auxilios dentales que todo papá y mamá debería conocer.",
    category: "Urgencias",
    emoji: "🚑",
    color: "sky",
    readMinutes: 3,
    content: `Los golpes en la boca son muy comunes entre los 1 y 3 años (cuando aprenden a caminar) y en edad escolar (deportes y juegos).

## Si el diente se partió

- Busca el fragmento y guárdalo en leche
- Enjuaga la boca con agua tibia
- Llámanos para una cita de urgencia

## Si un diente permanente se cayó

- Tómalo por la corona, **nunca por la raíz**
- Si está sucio, enjuágalo con leche sin frotarlo
- Guárdalo en leche o en la boca (entre la mejilla y la encía)
- Ven al consultorio en menos de **30 minutos**

## Si es un diente de leche

No lo vuelvas a poner en su lugar. Igual conviene revisarlo para proteger el diente permanente que viene en camino.`,
  },
];

const testimonials = [
  { parentName: "Laura Gómez", childName: "Samuel, 5 años", rating: 5, comment: "Samuel salió feliz con su diploma y ahora pide ir al odontólogo. El trato es increíble, se nota el amor por los niños." },
  { parentName: "Andrés Ríos", childName: "Valentina, 7 años", rating: 5, comment: "Mi hija tenía mucho miedo después de una mala experiencia. Aquí la trataron con tanta paciencia que perdió el miedo en dos citas." },
  { parentName: "Carolina Mejía", childName: "Tomás, 2 años", rating: 5, comment: "La primera visita de Tomás fue un juego. Nos dieron consejos súper útiles para la limpieza de sus dientitos." },
  { parentName: "Jorge Herrera", childName: "Martín, 9 años", rating: 4, comment: "Excelente la ortodoncia preventiva. Martín escogió su aparato de colores y lo usa con orgullo." },
  { parentName: "Paula Castaño", childName: "Emilia, 6 años", rating: 5, comment: "Emilia tiene autismo y el consultorio sensorial hizo toda la diferencia. Gracias por adaptarse a ella." },
  { parentName: "Diana Marín", childName: "Lucas, 4 años", rating: 5, comment: "Nos atendieron el mismo día cuando Lucas se golpeó jugando. Rápidos, calmados y muy profesionales." },
];

const gallery = [
  { title: "Adiós caries", treatment: "Cazadores de Caries", childAge: 6, duration: "2 citas", description: "Tratamos tres caries con resinas del color del diente y aplicamos flúor para proteger el resto.", before: "caries", after: "healthy", order: 1 },
  { title: "Dientes en su lugar", treatment: "Ortodoncia Preventiva", childAge: 8, duration: "10 meses", description: "Con un aparato removible de colores ganamos espacio y los incisivos se alinearon solitos.", before: "crowded", after: "aligned", order: 2 },
  { title: "Brillo de nuevo", treatment: "Limpieza Burbujeante", childAge: 5, duration: "1 cita", description: "Retiramos manchas de placa y enseñamos la técnica de cepillado con su crema favorita de fresa.", before: "stain", after: "healthy", order: 3 },
  { title: "Escudo en las muelas", treatment: "Escudo Protector", childAge: 7, duration: "1 cita", description: "Sellamos las muelas recién salidas para prevenir caries en las fisuras profundas.", before: "caries", after: "sealed", order: 4 },
  { title: "Espacio cerrado", treatment: "Ortodoncia Preventiva", childAge: 9, duration: "8 meses", description: "Corregimos un espacio causado por el hábito del chupo con aparatología y juegos de lengua.", before: "gap", after: "aligned", order: 5 },
  { title: "Mordida corregida", treatment: "Ortodoncia Preventiva", childAge: 6, duration: "6 meses", description: "Una mordida cruzada detectada a tiempo se corrigió con un expansor del paladar.", before: "crossbite", after: "aligned", order: 6 },
];

function nextWeekday(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  while (d.getDay() === 0) d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.post.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.galleryCase.deleteMany();
  await prisma.contactMessage.deleteMany();

  for (const s of services) await prisma.service.create({ data: s });
  for (const [i, p] of posts.entries()) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - i * 9);
    await prisma.post.create({ data: { ...p, createdAt, views: 40 + (posts.length - i) * 23 } });
  }
  for (const t of testimonials) await prisma.testimonial.create({ data: { ...t, approved: true } });
  await prisma.testimonial.create({
    data: { parentName: "Mariana López", childName: "Sofía, 3 años", rating: 5, comment: "¡Nos encantó! Sofía no quería irse de la sala de juegos.", approved: false },
  });
  for (const g of gallery) await prisma.galleryCase.create({ data: g });

  const all = await prisma.service.findMany();
  const sample = [
    { offset: 1, time: "09:00", parentName: "Laura Gómez", childName: "Samuel", childAge: 5, status: "CONFIRMADA" },
    { offset: 1, time: "10:30", parentName: "Andrés Ríos", childName: "Valentina", childAge: 7, status: "PENDIENTE" },
    { offset: 2, time: "15:00", parentName: "Carolina Mejía", childName: "Tomás", childAge: 2, status: "PENDIENTE" },
    { offset: 3, time: "08:30", parentName: "Jorge Herrera", childName: "Martín", childAge: 9, status: "CONFIRMADA" },
  ];
  for (const [i, a] of sample.entries()) {
    await prisma.appointment.create({
      data: {
        code: `SON-DEMO${i + 1}`,
        serviceId: all[i % all.length].id,
        date: nextWeekday(a.offset),
        time: a.time,
        parentName: a.parentName,
        phone: "300 123 45 67",
        email: "familia@ejemplo.com",
        childName: a.childName,
        childAge: a.childAge,
        status: a.status,
      },
    });
  }

  await prisma.contactMessage.create({
    data: {
      name: "Camila Torres",
      email: "camila@ejemplo.com",
      phone: "311 555 22 11",
      subject: "Talleres para colegio",
      message: "Hola, me gustaría saber si hacen la Escuela de Cepillado en colegios. Somos un jardín con 40 niños.",
    },
  });

  console.log("🌱 Base de datos sembrada con éxito");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
