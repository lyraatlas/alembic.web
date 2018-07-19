import { CONST } from "../../../constants";
import { ILikeable, ITokenPayload } from "../../../models";

export class BucketUtilities {

    public static getCurrentUserId(): string {
        return (JSON.parse(localStorage.getItem(CONST.CLIENT_DECODED_TOKEN_LOCATION)) as ITokenPayload).userId;
    }

    public  static calculateLikeStatus(items: Array<ILikeable>) {

        const userId = this.getCurrentUserId();
        items.forEach(bucket => {
            // we're going to flag the bucket as to whether the current user has liked this bucket.
            bucket.likedBy.forEach(token => {
                if (token == userId) {
                    bucket.isLikedByCurrentUser = true;
                }
            })
        });

    }
}