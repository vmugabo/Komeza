# Student Risk Assessment

This project looks at student information and identifies learners who may need
extra academic support.

It focuses on two types of risk:

- **Academic risk** shows whether a student's current performance may need
  attention.
- **Dropout risk** shows whether a student may be more likely to disengage or
  leave school.

The project uses information such as subject marks, study time, attendance,
assignment completion, internet access, travel time, and participation in
school activities. These details are combined to create clear risk categories:
**Low**, **Medium**, and **High**.

## How the project works

The work follows a simple process:

1. Load and inspect the student data.
2. Remove repeated records so that the same student is not counted more than
   once.
3. Explore the data using summaries, tables, and charts.
4. Create transparent rules for academic and dropout risk.
5. Prepare the information for machine learning.
6. Train and compare several classification models.
7. Review their accuracy, balanced performance, macro-F1 scores, and ability to
   identify high-risk students.
8. Keep the strongest models for use in the student-support system.

The models tested include logistic regression, a decision tree, random forest,
and XGBoost when it is available. The aim is not only to get good scores, but
also to compare different approaches and understand which information is most
useful.

## Important limitation

The data does not contain confirmed records showing which students actually
dropped out. For this reason, dropout risk is a screening estimate based on
attendance, performance, study habits, and engagement. It should help teachers
notice students who may need support, but it should not be treated as a final
decision about any student.

The same care is needed when interpreting academic risk. A risk category is a
starting point for discussion and support, not a judgement about a student's
ability or future.

## Project goal

The main goal is to support earlier and better intervention. Teachers and
education officers can use the results to identify students who may benefit
from encouragement, academic help, attendance follow-up, or other appropriate
support.
