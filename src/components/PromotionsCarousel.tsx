import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import promo1 from "@/assets/promo-1.png";
import promo2 from "@/assets/promo-2.png";
import promo3 from "@/assets/promo-3.png";
import promo4 from "@/assets/promo-4.png";
import promo5 from "@/assets/promo-5.png";

export const PromotionsCarousel = () => {
  const promotions = [
    { id: 1, image: promo1, alt: "Refer & Earn - Invite friends and earn rewards" },
    { id: 2, image: promo2, alt: "Earn ₦15,000 per referral" },
    { id: 3, image: promo3, alt: "Join Renix-Ultra today" },
    { id: 4, image: promo4, alt: "Refer & Earn - Join Renix-Ultra" },
    { id: 5, image: promo5, alt: "Refer & Earn - Big Announcement" },
  ];

  return (
    <div className="w-full px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {promotions.map((promo) => (
            <CarouselItem key={promo.id}>
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={promo.image}
                  alt={promo.alt}
                  className="w-full h-[160px] object-cover"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};
