// prisma/seed.ts
import { PrismaClient, Role, PriceLevel, Complexity, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Nettoyage
  console.log('🧹 Cleaning existing data...');
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.artisanLive.deleteMany();
  await prisma.artisan.deleteMany();
  await prisma.user.deleteMany();

  // 2. Mot de passe commun
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ==================== ARTISAN 1: Plombier Paris ====================
  console.log('👷 Creating artisan 1: Jean Dupont (Plombier - Paris)...');

  const user1 = await prisma.user.create({
    data: {
      email: 'jean.dupont@example.com',
      passwordHash: hashedPassword,
      role: Role.ARTISAN
    }
  });

  const artisan1 = await prisma.artisan.create({
    data: {
      id: user1.id,
      slug: 'paris-jean-dupont-plombier',
      name: 'Jean Dupont',
      category: 'plombier',
      city: 'paris',
      zipcode: '75001',
      address: '10 rue de Rivoli',
      lat: 48.8566,
      lng: 2.3522,
      phone: '0612345678',
      description:
        'Plombier professionnel depuis 15 ans. Intervention rapide pour tous vos problèmes de plomberie.',
      rating: 4.8,
      reviewCount: 127,
      priceLevel: PriceLevel.MEDIUM,
      serviceRadiusKm: 15,
      isActive: true
    }
  });

  // Services Jean
  const service1_1 = await prisma.service.create({
    data: {
      artisanId: artisan1.id,
      name: 'Dépannage urgent',
      description: 'Intervention rapide pour fuites et pannes urgentes',
      priceMinCents: 8000,
      priceMaxCents: 15000,
      estimatedDurationMin: 60,
      complexity: Complexity.MEDIUM,
      isActive: true
    }
  });

  const service1_2 = await prisma.service.create({
    data: {
      artisanId: artisan1.id,
      name: 'Installation WC',
      description: "Installation complète de WC et chasse d'eau",
      priceMinCents: 15000,
      priceMaxCents: 25000,
      estimatedDurationMin: 120,
      complexity: Complexity.MEDIUM,
      isActive: true
    }
  });

  const service1_3 = await prisma.service.create({
    data: {
      artisanId: artisan1.id,
      name: 'Débouchage canalisation',
      description: 'Débouchage professionnel avec garantie',
      priceMinCents: 6000,
      priceMaxCents: 12000,
      estimatedDurationMin: 45,
      complexity: Complexity.SIMPLE,
      isActive: true
    }
  });

  const today = new Date();

  // Disponibilités Jean : 7 prochains jours (matin + aprem)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    await prisma.availability.create({
      data: {
        artisanId: artisan1.id,
        startTs: new Date(date.setHours(9, 0, 0, 0)),
        endTs: new Date(date.setHours(12, 0, 0, 0)),
        isBooked: false
      }
    });

    await prisma.availability.create({
      data: {
        artisanId: artisan1.id,
        startTs: new Date(date.setHours(14, 0, 0, 0)),
        endTs: new Date(date.setHours(18, 0, 0, 0)),
        isBooked: false
      }
    });
  }

  // ==================== ARTISAN 2: Électricien Lyon ====================
  console.log('👷 Creating artisan 2: Marie Laurent (Électricienne - Lyon)...');

  const user2 = await prisma.user.create({
    data: {
      email: 'marie.laurent@example.com',
      passwordHash: hashedPassword,
      role: Role.ARTISAN
    }
  });

  const artisan2 = await prisma.artisan.create({
    data: {
      id: user2.id,
      slug: 'lyon-marie-laurent-electricien',
      name: 'Marie Laurent',
      category: 'electricien',
      city: 'lyon',
      zipcode: '69001',
      address: '25 rue de la République',
      lat: 45.764,
      lng: 4.8357,
      phone: '0687654321',
      description:
        'Électricienne qualifiée, spécialiste des installations domestiques et dépannages.',
      rating: 4.9,
      reviewCount: 203,
      priceLevel: PriceLevel.MEDIUM,
      serviceRadiusKm: 20,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan2.id,
      name: 'Dépannage électrique urgent',
      description: 'Intervention rapide pour pannes et courts-circuits',
      priceMinCents: 9000,
      priceMaxCents: 18000,
      estimatedDurationMin: 90,
      complexity: Complexity.MEDIUM,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan2.id,
      name: 'Installation tableau électrique',
      description: 'Installation ou mise aux normes de tableau électrique',
      priceMinCents: 30000,
      priceMaxCents: 50000,
      estimatedDurationMin: 240,
      complexity: Complexity.COMPLEX,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan2.id,
      name: 'Changement de prises',
      description: 'Remplacement ou ajout de prises électriques',
      priceMinCents: 4000,
      priceMaxCents: 8000,
      estimatedDurationMin: 30,
      complexity: Complexity.SIMPLE,
      isActive: true
    }
  });

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    await prisma.availability.create({
      data: {
        artisanId: artisan2.id,
        startTs: new Date(date.setHours(8, 0, 0, 0)),
        endTs: new Date(date.setHours(12, 0, 0, 0)),
        isBooked: false
      }
    });

    await prisma.availability.create({
      data: {
        artisanId: artisan2.id,
        startTs: new Date(date.setHours(13, 30, 0, 0)),
      endTs: new Date(date.setHours(17, 30, 0, 0)),
        isBooked: false
      }
    });
  }

  // ==================== ARTISAN 3: Peintre Paris ====================
  console.log('👷 Creating artisan 3: Pierre Martin (Peintre - Paris)...');

  const user3 = await prisma.user.create({
    data: {
      email: 'pierre.martin@example.com',
      passwordHash: hashedPassword,
      role: Role.ARTISAN
    }
  });

  const artisan3 = await prisma.artisan.create({
    data: {
      id: user3.id,
      slug: 'paris-pierre-martin-peintre',
      name: 'Pierre Martin',
      category: 'peintre',
      city: 'paris',
      zipcode: '75015',
      address: '42 avenue Émile Zola',
      lat: 48.8467,
      lng: 2.2945,
      phone: '0698765432',
      description:
        "Peintre en bâtiment avec 20 ans d'expérience. Travail soigné et ponctuel.",
      rating: 4.6,
      reviewCount: 89,
      priceLevel: PriceLevel.LOW,
      serviceRadiusKm: 10,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan3.id,
      name: 'Peinture pièce standard',
      description: "Peinture d'une pièce jusqu'à 20m²",
      priceMinCents: 20000,
      priceMaxCents: 35000,
      estimatedDurationMin: 480,
      complexity: Complexity.MEDIUM,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan3.id,
      name: 'Retouches et petits travaux',
      description: 'Retouches de peinture, plinthes, etc.',
      priceMinCents: 8000,
      priceMaxCents: 15000,
      estimatedDurationMin: 120,
      complexity: Complexity.SIMPLE,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan3.id,
      name: 'Peinture appartement complet',
      description: "Peinture complète d'un appartement (T2-T3)",
      priceMinCents: 80000,
      priceMaxCents: 150000,
      estimatedDurationMin: 1440,
      complexity: Complexity.COMPLEX,
      isActive: true
    }
  });

  // dispo un jour sur deux
  for (let i = 1; i <= 7; i++) {
    if (i % 2 === 0) continue;

    const date = new Date(today);
    date.setDate(date.getDate() + i);

    await prisma.availability.create({
      data: {
        artisanId: artisan3.id,
        startTs: new Date(date.setHours(8, 0, 0, 0)),
        endTs: new Date(date.setHours(17, 0, 0, 0)),
        isBooked: false
      }
    });
  }

  // ==================== ARTISAN 4: Serrurier Marseille ====================
  console.log('👷 Creating artisan 4: Ahmed Benzema (Serrurier - Marseille)...');

  const user4 = await prisma.user.create({
    data: {
      email: 'ahmed.benzema@example.com',
      passwordHash: hashedPassword,
      role: Role.ARTISAN
    }
  });

  const artisan4 = await prisma.artisan.create({
    data: {
      id: user4.id,
      slug: 'marseille-ahmed-benzema-serrurier',
      name: 'Ahmed Benzema',
      category: 'serrurier',
      city: 'marseille',
      zipcode: '13001',
      address: '15 rue Paradis',
      lat: 43.2965,
      lng: 5.3698,
      phone: '0656781234',
      description:
        'Serrurier disponible 24h/24 pour tous types de serrures. Ouverture de porte sans casse.',
      rating: 4.7,
      reviewCount: 156,
      priceLevel: PriceLevel.HIGH,
      serviceRadiusKm: 25,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan4.id,
      name: 'Ouverture de porte claquée',
      description: 'Ouverture sans casse, intervention rapide',
      priceMinCents: 7000,
      priceMaxCents: 12000,
      estimatedDurationMin: 30,
      complexity: Complexity.SIMPLE,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan4.id,
      name: 'Changement de serrure',
      description: 'Remplacement de serrure complète (3 points)',
      priceMinCents: 15000,
      priceMaxCents: 30000,
      estimatedDurationMin: 90,
      complexity: Complexity.MEDIUM,
      isActive: true
    }
  });

  await prisma.service.create({
    data: {
      artisanId: artisan4.id,
      name: 'Installation blindée',
      description: 'Installation de porte blindée certifiée',
      priceMinCents: 100000,
      priceMaxCents: 200000,
      estimatedDurationMin: 480,
      complexity: Complexity.COMPLEX,
      isActive: true
    }
  });

  // dispo matin/aprem/soir
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    await prisma.availability.create({
      data: {
        artisanId: artisan4.id,
        startTs: new Date(date.setHours(6, 0, 0, 0)),
        endTs: new Date(date.setHours(12, 0, 0, 0)),
        isBooked: false
      }
    });

    await prisma.availability.create({
      data: {
        artisanId: artisan4.id,
        startTs: new Date(date.setHours(12, 0, 0, 0)),
        endTs: new Date(date.setHours(18, 0, 0, 0)),
        isBooked: false
      }
    });

    await prisma.availability.create({
      data: {
        artisanId: artisan4.id,
        startTs: new Date(date.setHours(18, 0, 0, 0)),
        endTs: new Date(date.setHours(23, 0, 0, 0)),
        isBooked: false
      }
    });
  }

  // ==================== EXEMPLES DE RDV ====================
  console.log('📅 Creating sample appointments...');

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const slot1 = await prisma.availability.findFirst({
    where: { artisanId: artisan1.id, startTs: { gte: tomorrow } }
  });

  if (slot1) {
    await prisma.appointment.create({
      data: {
        artisanId: artisan1.id,
        serviceId: service1_1.id,
        customerName: 'Sophie Dubois',
        customerEmail: 'sophie.dubois@example.com',
        customerPhone: '0623456789',
        customerNotes: "Fuite sous l'évier de cuisine",
        startTs: slot1.startTs,
        endTs: slot1.endTs,
        status: AppointmentStatus.CONFIRMED
      }
    });

    await prisma.availability.update({
      where: { id: slot1.id },
      data: { isBooked: true }
    });
  }

  const slot2 = await prisma.availability.findFirst({
    where: { artisanId: artisan2.id, isBooked: false }
  });

  if (slot2) {
    const firstService2 = await prisma.service.findFirst({
      where: { artisanId: artisan2.id }
    });

    if (firstService2) {
      await prisma.appointment.create({
        data: {
          artisanId: artisan2.id,
          serviceId: firstService2.id,
          customerName: 'Thomas Petit',
          customerEmail: 'thomas.petit@example.com',
          customerPhone: '0634567890',
          customerNotes: 'Panne électrique dans le salon',
          startTs: slot2.startTs,
          endTs: slot2.endTs,
          status: AppointmentStatus.PENDING
        }
      });

      await prisma.availability.update({
        where: { id: slot2.id },
        data: { isBooked: true }
      });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - 4 artisans created');
  console.log('  - 11 services created');
  console.log('  - ~100 availability slots created');
  console.log('  - 2 sample appointments created');
  console.log('\n🔐 Test credentials (password123 pour tous):');
  console.log('  jean.dupont@example.com');
  console.log('  marie.laurent@example.com');
  console.log('  pierre.martin@example.com');
  console.log('  ahmed.benzema@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
