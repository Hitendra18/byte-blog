import {
  FaFacebookSquare,
  FaRedditSquare,
  FaTwitterSquare,
  FaWhatsappSquare,
} from "react-icons/fa";

const SocialShareButtons = ({ url, title }) => {
  return (
    <div className="flex gap-x-2 justify-center lg:justify-start">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/share?text=${title}&url=${url}&hashtags=blog,webDev
`}
      >
        <FaTwitterSquare className="text-[#00ACEE] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`http://reddit.com/submit?url=${url}&title=${title}`}
      >
        <FaRedditSquare className="text-[#FF4500] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://api.whatsapp.com/send?text=${title + " " + url}`}
      >
        <FaWhatsappSquare className="text-[#25D366] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/share.php?u=${"https://www.youtube.com"}`}
        // href={`https://www.facebook.com/dialog/share?app_id=357137607282958&display=popup&href=${"https://www.youtube.com"}`}
        // href={`https://www.facebook.com/dialog/share?app_id=357137607282958&display=popup&href=https://www.youtube.com`}
      >
        <FaFacebookSquare className="text-[#3B5998] w-12 h-auto" />
      </a>
    </div>
  );
};
export default SocialShareButtons;
