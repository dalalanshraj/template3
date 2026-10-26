
import { useState } from "react";
import api from "../api/axios.js";
import { X, Star, CalendarDays, User, Mail, MessageSquare } from "lucide-react";
import {
 
  ArrowRight,
} from "lucide-react";
export default function ReviewModal({ listingId, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    message: "",
    stayDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.rating) {
      setError("Please select a star rating.");
      return;
    }

    if (!form.name.trim() || !form.email.trim() ||
      !form.title.trim() || !form.message.trim() || !form.stayDate) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/listings/${listingId}/reviews`, {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        title: form.title.trim(),
        message: form.message.trim(),
      });

      alert("Review submitted successfully for approval.");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[#00989c] focus:bg-white focus:ring-2 focus:ring-[#00989c]/10";

  return (
    <div
      className="fixed inset-0 z-[100]  flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="relative my-auto max-h-[92vh]  w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8 mb-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>

            <h2
            className="
        text-[30px] font-semibold
        uppercase leading-tight
        tracking-[-0.035em]
        text-[#171717]
        drop-shadow-[2px_3px_1px_rgba(0,0,0,0.25)]
        sm:text-4xl
        lg:text-[48px]
        xl:text-[40px]
      "
            style={{
              fontFamily: '"Oswald", sans-serif',
            }}
          >
              Write a Review
            </h2>

            <p className="text-gray-600
            text-base
            md:text-lg
            xl:text-xl
            leading-relaxed
            font-light">
              Tell us about your stay and help future guests.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close review form"
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={submitReview} className="space-y-4 mb-3">
          {/* Star rating */}
          <div>
            <label className=" uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
              Your Rating <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} out of 5 stars`}
                  aria-pressed={form.rating === star}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, rating: star }))
                  }
                  className="rounded p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#00989c]"
                >
                  <Star
                    size={29}
                    className={
                      form.rating >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}

              <span className=" text-gray-600
            text-base
            md:text-md
            xl:text-md
            leading-relaxed
            font-light">
                {form.rating ? `${form.rating}/5` : "Select rating"}
              </span>
            </div>
          </div>

          {/* Name */}
       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* Name */}
  <div className="min-w-0">
    <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
      Full Name <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <User
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        name="name"
        autoComplete="name"
        placeholder="Enter your name"
        className={`${inputClass} pl-10`}
        value={form.name}
        onChange={handleChange}
        maxLength={100}
        required
      />
    </div>
  </div>

  {/* Email */}
  <div className="min-w-0">
    <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
      Email Address <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <Mail
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        className={`${inputClass} pl-10`}
        value={form.email}
        onChange={handleChange}
        maxLength={254}
        required
      />
    </div>
  </div>
</div>

         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* Review Title */}
  <div className="min-w-0">
    <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
      Review Title <span className="text-red-500">*</span>
    </label>

    <input
      name="title"
      placeholder="Give your review a title"
      className={inputClass}
      value={form.title}
      onChange={handleChange}
      maxLength={150}
      required
    />
  </div>

  {/* Date of Stay */}
  <div className="min-w-0">
    <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
      Date of Stay <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <CalendarDays
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="date"
        name="stayDate"
        className={`${inputClass} pl-10`}
        value={form.stayDate}
        onChange={handleChange}
        max={new Date().toISOString().slice(0, 10)}
        required
      />
    </div>
  </div>
</div>
         

          {/* Message */}
          <div>
            <label className="uppercase
            tracking-[3px]
            md:tracking-[4px]
           text-black
            text-xs
            md:text-[13px]
            mb-6">
              Your Experience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MessageSquare
                size={17}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <textarea
                name="message"
                placeholder="What did you enjoy about your stay?"
                className={`${inputClass} resize-y pl-10`}
                rows={4}
                value={form.message}
                onChange={handleChange}
                maxLength={3000}
                required
              />
            </div>
            <p className="mt-1 text-right text-xs text-gray-400">
              {form.message.length}/3000
            </p>
          </div>

          {/* Stay date */}
         

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
        group relative mt-6
        inline-flex min-h-[58px]
        min-w-[185px] items-center
        justify-center gap-3
        bg-[#171717] px-7 py-4
        text-[13px] font-semibold
        tracking-[0.19em] text-white
        shadow-[8px_8px_0px_#252525]
        transition-all duration-300
        hover:-translate-x-1 hover:-translate-y-1
        hover:bg-[#315F60]
        hover:shadow-[10px_10px_0px_#252525]
        active:translate-x-1 active:translate-y-1
        active:shadow-none
        sm:min-w-[200px]
      "
      style={{
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            className="
        group relative mt-6
        inline-flex min-h-[58px]
        min-w-[185px] items-center
        justify-center gap-3
        bg-[#171717] px-7 py-4
        text-[13px] font-semibold
        tracking-[0.19em] text-white
        shadow-[8px_8px_0px_#252525]
        transition-all duration-300
        hover:-translate-x-1 hover:-translate-y-1
        hover:bg-[#315F60]
        hover:shadow-[10px_10px_0px_#252525]
        active:translate-x-1 active:translate-y-1
        active:shadow-none
        sm:min-w-[200px]
      "
      style={{
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
