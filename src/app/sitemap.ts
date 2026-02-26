import { MetadataRoute } from 'next';
import plantsData from '@/data/plants.json';
import { Plant } from '@/types';

const PLANTS = plantsData.plants as Plant[];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gardenhorizonstools.com';
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/plants`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/mutations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/codes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const plantPages: MetadataRoute.Sitemap = PLANTS.map((plant) => ({
    url: `${baseUrl}/plants/${plant.slug}`,
    lastModified: new Date(plant.last_verified_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...plantPages];
}
