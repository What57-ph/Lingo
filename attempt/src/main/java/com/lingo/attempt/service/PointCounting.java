package com.lingo.attempt.service;

import com.lingo.attempt.utils.Constants;

public class PointCounting {

  private static final double[] IELTS_LISTENING_BANDS = {
      0, 0, 0, 0, 2.5, // 0-4 correct
      3.0, 3.0, 3.0, 3.0, // 5-8 correct
      3.5, 4.0, 4.0, 4.0, // 9-12 correct
      4.5, 4.5, 5.0, 5.0, // 13-16 correct
      5.0, 5.5, 5.5, 6.0, // 17-20 correct
      6.0, 6.0, 6.5, 6.5, // 21-24 correct
      6.5, 7.0, 7.0, 7.0, // 25-28 correct
      7.5, 7.5, 8.0, 8.0, // 29-32 correct
      8.0, 8.5, 8.5, 8.5, // 33-36 correct
      9.0, 9.0, 9.0, 9.0 // 37-40 correct
  };

  // IELTS Reading Academic band score conversion (40 questions)
  private static final double[] IELTS_READING_ACADEMIC_BANDS = {
      0, 0, 0, 0, 2.5, // 0-4 correct
      3.0, 3.0, 3.0, 3.5, // 5-8 correct
      3.5, 4.0, 4.0, 4.0, // 9-12 correct
      4.5, 4.5, 5.0, 5.0, // 13-16 correct
      5.5, 5.5, 6.0, 6.0, // 17-20 correct
      6.0, 6.5, 6.5, 6.5, // 21-24 correct
      7.0, 7.0, 7.0, 7.5, // 25-28 correct
      7.5, 8.0, 8.0, 8.0, // 29-32 correct
      8.5, 8.5, 8.5, 9.0, // 33-36 correct
      9.0, 9.0, 9.0, 9.0 // 37-40 correct
  };

  public static double[] calculatePoint(String type, int[] count) {
    return calculatePoint(type, count, null);
  }

  public static double[] calculatePoint(String type, int[] count, String subType) {
    if (type.equals("TOEIC")) {
      return calculateToeicScore(count);
    } else if (type.equals("IELTS")) {
      return calculateIeltsScore(count, subType);
    }
    return new double[] { 0, 0 };
  }

  private static double[] calculateToeicScore(int[] count) {
    if (count[0] > Constants.TOEIC_PERFECT_SCORE_SECTION && count[1] > Constants.TOEIC_PERFECT_SCORE_SECTION) {
      return new double[] { Constants.TOEIC_MAX_SECTION_SCORE, Constants.TOEIC_MAX_SECTION_SCORE };
    } else if (count[0] > 96 && count[1] <= 96) {
      return new double[] { Constants.TOEIC_MAX_SECTION_SCORE, count[1] * Constants.TOEIC_POINT_PER_QUESTION };
    } else if (count[0] <= 96 && count[1] > 96) {
      return new double[] { count[0] * Constants.TOEIC_POINT_PER_QUESTION, Constants.TOEIC_MAX_SECTION_SCORE };
    } else {
      return new double[] { count[0] * Constants.TOEIC_POINT_PER_QUESTION,
          count[1] * Constants.TOEIC_POINT_PER_QUESTION };
    }
  }

  private static double[] calculateIeltsScore(int[] count, String subType) {
    double[] scores = new double[count.length];

    for (int i = 0; i < count.length; i++) {
      int correctCount = Math.min(count[i], 40);
      scores[i] = getIeltsBandScore(correctCount, i, subType);
    }

    return scores;
  }

  private static double getIeltsBandScore(int correctAnswers, int skillIndex, String subType) {
    if (correctAnswers < 0 || correctAnswers > 40) {
      return 0;
    }
    // skillIndex 0 = Listening, skillIndex 1 = Reading
    if (skillIndex == 0) {
      // Listening
      return IELTS_LISTENING_BANDS[correctAnswers];
    } else {
      // Default to Academic
      return IELTS_READING_ACADEMIC_BANDS[correctAnswers];
    }
  }
}