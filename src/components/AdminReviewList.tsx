"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Review = {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  approved: boolean;
};

export default function AdminReviewList() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, approved")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function approveReview(id: number) {
    const { error } = await supabase
      .from("reviews")
      .update({ approved: true })
      .eq("id", id);

    if (!error) {
      await loadReviews();
    }
  }

  async function deleteReview(id: number) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (!error) {
      await loadReviews();
    }
  }

  return (
    <section className="mt-12 border-t border-gray-800 pt-8">
      <h2 className="mb-6 text-2xl font-bold">
        Reseñas de clientes
      </h2>

      {loading && (
        <p className="text-gray-400">Cargando reseñas...</p>
      )}

      {!loading && reviews.length === 0 && (
        <p className="text-gray-400">No hay reseñas pendientes.</p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-gray-800 p-5"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="font-semibold">
                {review.customer_name}
              </p>

              <span
                className={
                  review.approved
                    ? "text-sm text-green-400"
                    : "text-sm text-amber-400"
                }
              >
                {review.approved ? "Aprobada" : "Pendiente"}
              </span>
            </div>

            <p className="mb-3 text-amber-400">
              {"★".repeat(review.rating)}
            </p>

            <p className="mb-4 text-gray-300">
              {review.comment}
            </p>

            <div className="flex gap-3">
              {!review.approved && (
                <button
                  type="button"
                  onClick={() => approveReview(review.id)}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                  Aprobar
                </button>
              )}

              <button
                type="button"
                onClick={() => deleteReview(review.id)}
                className="rounded-lg border border-red-800 px-4 py-2 text-sm text-red-400"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}